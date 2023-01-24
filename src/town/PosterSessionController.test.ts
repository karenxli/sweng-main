import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import { readFileSync } from 'fs';

import {
  Interactable,
  TownEmitter,
  PosterSessionArea,
  ViewingArea,
} from '../types/CoveyTownSocket';
import TownsStore from '../lib/TownsStore';

import {
  getLastEmittedEvent,
  mockPlayer,
  MockedPlayer,
  isPosterSessionArea,
  isViewingArea,
} from '../TestUtils';
import { TownsController } from './TownsController';

interface TestTownData {
  friendlyName: string;
  townID: string;
  isPubliclyListed: boolean;
  townUpdatePassword: string;
}

const broadcastEmitter = jest.fn();
describe('TownsController integration tests', () => {
  let controller: TownsController;

  const createdTownEmitters: Map<string, DeepMockProxy<TownEmitter>> = new Map();
  async function createTownForTesting(
    friendlyNameToUse?: string,
    isPublic = false,
  ): Promise<TestTownData> {
    const friendlyName =
      friendlyNameToUse !== undefined
        ? friendlyNameToUse
        : `${isPublic ? 'Public' : 'Private'}TestingTown=${nanoid()}`;
    const ret = await controller.createTown({
      friendlyName,
      isPubliclyListed: isPublic,
      mapFile: 'testData/indoors.json',
    });
    return {
      friendlyName,
      isPubliclyListed: isPublic,
      townID: ret.townID,
      townUpdatePassword: ret.townUpdatePassword,
    };
  }
  function getBroadcastEmitterForTownID(townID: string) {
    const ret = createdTownEmitters.get(townID);
    if (ret == null) {
      throw new Error(`Could not find broadcast emitter for ${townID}`);
    }
    return ret;
  }

  beforeAll(() => {
    // Set the twilio tokens to dummy values so that the unit tests can run
    process.env.TWILIO_API_AUTH_TOKEN = 'testing';
    process.env.TWILIO_ACCOUNT_SID = 'ACtesting';
    process.env.TWILIO_API_KEY_SID = 'testing';
    process.env.TWILIO_API_KEY_SECRET = 'testing';
  });

  beforeEach(async () => {
    createdTownEmitters.clear();
    broadcastEmitter.mockImplementation((townID: string) => {
      const mockRoomEmitter = mockDeep<TownEmitter>();
      createdTownEmitters.set(townID, mockRoomEmitter);
      return mockRoomEmitter;
    });
    TownsStore.initializeTownsStore(broadcastEmitter);
    controller = new TownsController();
  });

  describe('Interactables', () => {
    let testingTown: TestTownData;
    let player: MockedPlayer;
    let sessionToken: string;
    let interactables: Interactable[];
    beforeEach(async () => {
      testingTown = await createTownForTesting(undefined, true);
      player = mockPlayer(testingTown.townID);
      await controller.joinTown(player.socket);
      const initialData = getLastEmittedEvent(player.socket, 'initialize');
      sessionToken = initialData.sessionToken;
      interactables = initialData.interactables;
    });

    describe('Create Poster Session Area', () => {
      it('Executes without error when creating a new poster session area', async () => {
        const posterSessionArea = interactables.find(isPosterSessionArea) as PosterSessionArea;
        if (!posterSessionArea) {
          fail('Expected at least one poster session area to be returned in the initial join data');
        } else {
          const newPosterSessionArea = {
            id: posterSessionArea.id,
            stars: 0,
            title: 'Test title',
            imageContents: readFileSync('testData/poster.jpg', 'utf-8'),
          };
          await controller.createPosterSessionArea(
            testingTown.townID,
            sessionToken,
            newPosterSessionArea,
          );
          // Check to see that the poster session area was successfully updated
          const townEmitter = getBroadcastEmitterForTownID(testingTown.townID);
          const updateMessage = getLastEmittedEvent(townEmitter, 'interactableUpdate');
          if (isPosterSessionArea(updateMessage)) {
            expect(updateMessage).toEqual(newPosterSessionArea);
          } else {
            fail(
              'Expected an interactableUpdate to be dispatched with the new poster session area',
            );
          }
        }
      });
      it('Returns an error message if the town ID is invalid', async () => {
        const posterSessionArea = interactables.find(isPosterSessionArea) as PosterSessionArea;
        const newPosterSessionArea = {
          id: posterSessionArea.id,
          stars: 0,
          title: 'Test title',
          imageContents: readFileSync('testData/poster.jpg', 'utf-8'),
        };
        await expect(
          controller.createPosterSessionArea(nanoid(), sessionToken, newPosterSessionArea),
        ).rejects.toThrow();
      });
      it('Checks for a valid session token before creating a poster session area', async () => {
        const invalidSessionToken = nanoid();
        const posterSessionArea = interactables.find(isPosterSessionArea) as PosterSessionArea;
        const newPosterSessionArea = {
          id: posterSessionArea.id,
          stars: 0,
          title: 'Test title',
          imageContents: readFileSync('testData/poster.jpg', 'utf-8'),
        };
        await expect(
          controller.createPosterSessionArea(
            testingTown.townID,
            invalidSessionToken,
            newPosterSessionArea,
          ),
        ).rejects.toThrow();
      });
      it('Returns an error message if addPosterSessionArea returns false', async () => {
        const posterSessionArea = interactables.find(isPosterSessionArea) as PosterSessionArea;
        const newPosterSessionArea = {
          id: nanoid(),
          stars: posterSessionArea.stars,
          title: posterSessionArea.title,
          imageContents: posterSessionArea.imageContents,
        };
        await expect(
          controller.createPosterSessionArea(
            testingTown.townID,
            sessionToken,
            newPosterSessionArea,
          ),
        ).rejects.toThrow();
      });
      it('Cant create a poster session area with no image', async () => {
        const posterSessionArea = interactables.find(isPosterSessionArea) as PosterSessionArea;
        if (!posterSessionArea) {
          fail('Expected at least one poster session area to be returned in the initial join data');
        } else {
          const newPosterSessionArea = {
            id: posterSessionArea.id,
            stars: 0,
            title: 'Test title',
            // image contents is undefined
          };
          await expect(
            controller.createPosterSessionArea(
              testingTown.townID,
              sessionToken,
              newPosterSessionArea,
            ),
          ).rejects.toThrow();
        }
      });
      it('Cant create a poster session area with no title', async () => {
        const posterSessionArea = interactables.find(isPosterSessionArea) as PosterSessionArea;
        if (!posterSessionArea) {
          fail('Expected at least one poster session area to be returned in the initial join data');
        } else {
          const newPosterSessionArea = {
            id: posterSessionArea.id,
            stars: 0,
            imageContents: readFileSync('testData/poster.jpg', 'utf-8'),
            // title is undefined
          };
          await expect(
            controller.createPosterSessionArea(
              testingTown.townID,
              sessionToken,
              newPosterSessionArea,
            ),
          ).rejects.toThrow();
        }
      });
    });
    describe('Interact with existing Poster Session Area', () => {
      // testing in progress
      it('Increments number of stars on a poster session area', async () => {
        const posterSessionArea = interactables.find(isPosterSessionArea) as PosterSessionArea;
        if (!posterSessionArea) {
          fail('Expected at least one poster session area to be returned in the initial join data');
        } else {
          const newPosterSessionArea = {
            id: posterSessionArea.id,
            stars: 0,
            title: 'Test title',
            imageContents: readFileSync('testData/poster.jpg', 'utf-8'),
          };
          await controller.createPosterSessionArea(
            testingTown.townID,
            sessionToken,
            newPosterSessionArea,
          );
          const numStars = await controller.incrementPosterAreaStars(
            testingTown.townID,
            posterSessionArea.id,
            sessionToken,
          );
          expect(numStars).toEqual(newPosterSessionArea.stars + 1);
        }
      });
      it('Gets the image contents of a poster session area', async () => {
        const posterSessionArea = interactables.find(isPosterSessionArea) as PosterSessionArea;
        if (!posterSessionArea) {
          fail('Expected at least one poster session area to be returned in the initial join data');
        } else {
          const newPosterSessionArea = {
            id: posterSessionArea.id,
            stars: 0,
            title: 'Test title',
            imageContents: readFileSync('testData/poster.jpg', 'utf-8'),
          };
          await controller.createPosterSessionArea(
            testingTown.townID,
            sessionToken,
            newPosterSessionArea,
          );
          const imageContents = await controller.getPosterAreaImageContents(
            testingTown.townID,
            posterSessionArea.id,
            sessionToken,
          );
          expect(imageContents).toEqual(newPosterSessionArea.imageContents);
        }
      });
    });
    describe('[T3] Get Poster Image Contents', () => {
      // this stays the same
      it('Returns an error message if the town ID is invalid', async () => {
        const posterArea = interactables.find(isPosterSessionArea) as PosterSessionArea;
        const invalidTown = nanoid();
        await expect(
          controller.getPosterAreaImageContents(invalidTown, posterArea.id, sessionToken),
        ).rejects.toThrow();
      });
      it('Checks for a valid session token before fetching the poster contents', async () => {
        const invalidSessionToken = nanoid();
        const posterArea = interactables.find(isPosterSessionArea) as PosterSessionArea;

        if (!posterArea) {
          fail('Expected at least one poster area to be returned in the initial join data');
        } else {
          const newPosterArea: PosterSessionArea = {
            id: posterArea.id,
            stars: 0,
            imageContents: 'sss',
            title: nanoid(),
          };
          await controller.createPosterSessionArea(testingTown.townID, sessionToken, newPosterArea);
        }
        await expect(
          // eslint-disable-next-line prettier/prettier
          controller.getPosterAreaImageContents(testingTown.townID, posterArea.id, invalidSessionToken),
        ).rejects.toThrow();
      });
      it('Returns an error message if the poster session specified doesnt exist', async () => {
        const invalidPosterSession = nanoid();
        await expect(
          // eslint-disable-next-line prettier/prettier
          controller.getPosterAreaImageContents(testingTown.townID, invalidPosterSession, sessionToken),
        ).rejects.toThrow();
      });
      it('Returns an error message if the poster session specified isnt a PosterSession', async () => {
        const viewingArea = interactables.find(isViewingArea) as ViewingArea;
        if (!viewingArea) {
          fail('Expected at least one viewing area to be returned in the initial join data');
        } else {
          const newViewingArea: ViewingArea = {
            elapsedTimeSec: 100,
            id: viewingArea.id,
            video: nanoid(),
            isPlaying: true,
          };
          await controller.createViewingArea(testingTown.townID, sessionToken, newViewingArea);
        }
        await expect(
          controller.getPosterAreaImageContents(testingTown.townID, viewingArea.id, sessionToken),
        ).rejects.toThrow();
      });
      it('Returns the image contents of the poster session that exist', async () => {
        const posterArea = interactables.find(isPosterSessionArea) as PosterSessionArea;
        if (!posterArea) {
          fail('Expected at least one poster area to be returned in the initial join data');
        } else {
          const newPosterArea: PosterSessionArea = {
            id: posterArea.id,
            stars: 0,
            imageContents: 'sss',
            title: nanoid(),
          };
          await controller.createPosterSessionArea(testingTown.townID, sessionToken, newPosterArea);
          // check to see that the poster area session was correctly fetched

          await controller.getPosterAreaImageContents(
            testingTown.townID,
            newPosterArea.id,
            sessionToken,
          );
          const townEmitter = getBroadcastEmitterForTownID(testingTown.townID);
          //          ^?
          const updateMessage = getLastEmittedEvent(townEmitter, 'interactableUpdate');
          //          ^?
          if (isPosterSessionArea(updateMessage)) {
            expect(updateMessage).toEqual(newPosterArea);
          } else {
            fail('Expected an interactable Update to be dispatched with the postersession area');
          }
        }
      });
      it('Returns the image contents of a poster session, where the contents are undefined (inactive session)', async () => {
        const townsStore = TownsStore.getInstance();
        const townNum = townsStore.getTowns()[0].townID;
        //        ^?
        const newTown = townsStore.getTownByID(townNum);
        const emptyPoster = newTown?.interactables.find(t => isPosterSessionArea(t) && !t.isActive);
        if (!emptyPoster) {
          fail('Expected at least one poster area to be present');
        }
        await expect(
          controller.getPosterAreaImageContents(testingTown.townID, emptyPoster.id, sessionToken),
        ).resolves.toBe(undefined);
      });
    });
    // work on this next
    describe('[T4] Increment Poster Star Count', () => {
      // this stays the same
      it('Returns an error message if the town ID is invalid', async () => {
        const posterArea = interactables.find(isPosterSessionArea) as PosterSessionArea;
        const invalidTown = nanoid();
        await expect(
          controller.incrementPosterAreaStars(invalidTown, posterArea.id, sessionToken),
        ).rejects.toThrow();
      });
      it('Checks for a valid session token before fetching the poster contents', async () => {
        const invalidSessionToken = nanoid();
        const posterArea = interactables.find(isPosterSessionArea) as PosterSessionArea;

        await expect(
          // eslint-disable-next-line prettier/prettier
          controller.incrementPosterAreaStars(testingTown.townID, posterArea.id, invalidSessionToken),
        ).rejects.toThrow();
      });
      it('Returns an error message if the poster session specified doesnt exist', async () => {
        const invalidPosterSession = nanoid();

        await expect(
          // eslint-disable-next-line prettier/prettier
          controller.incrementPosterAreaStars(testingTown.townID, invalidPosterSession, sessionToken),
        ).rejects.toThrow();
      });
    });
    it('Returns an error message if the poster session specified isnt a PosterSession', async () => {
      const viewingArea = interactables.find(isViewingArea) as ViewingArea;
      if (!viewingArea) {
        fail('Expected at least one viewing area to be returned in the initial join data');
      } else {
        const newViewingArea: ViewingArea = {
          elapsedTimeSec: 100,
          id: viewingArea.id,
          video: nanoid(),
          isPlaying: true,
        };
        await controller.createViewingArea(testingTown.townID, sessionToken, newViewingArea);
      }
      await expect(
        controller.incrementPosterAreaStars(testingTown.townID, viewingArea.id, sessionToken),
      ).rejects.toThrow();
    });
  });
});
