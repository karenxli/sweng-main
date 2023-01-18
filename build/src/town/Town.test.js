import { mockClear, mockDeep, mockReset } from 'jest-mock-extended'
import { nanoid } from 'nanoid'
import TwilioVideo from '../lib/TwilioVideo'
import { expectArraysToContainSameMembers, getEventListener, getLastEmittedEvent, mockPlayer } from '../TestUtils'
import Town from './Town'
const mockTwilioVideo = mockDeep()
jest.spyOn(TwilioVideo, 'getInstance').mockReturnValue(mockTwilioVideo)
const testingMaps = {
  twoConv: {
    tiledversion: '1.9.0',
    tileheight: 32,
    tilesets: [],
    tilewidth: 32,
    type: 'map',
    layers: [
      {
        id: 4,
        name: 'Objects',
        objects: [
          {
            type: 'ConversationArea',
            height: 237,
            id: 39,
            name: 'Name1',
            rotation: 0,
            visible: true,
            width: 326,
            x: 40,
            y: 120
          },
          {
            type: 'ConversationArea',
            height: 266,
            id: 43,
            name: 'Name2',
            rotation: 0,
            visible: true,
            width: 467,
            x: 612,
            y: 120
          }
        ],
        opacity: 1,
        type: 'objectgroup',
        visible: true,
        x: 0,
        y: 0
      }
    ]
  },
  overlapping: {
    tiledversion: '1.9.0',
    tileheight: 32,
    tilesets: [],
    tilewidth: 32,
    type: 'map',
    layers: [
      {
        id: 4,
        name: 'Objects',
        objects: [
          {
            type: 'ConversationArea',
            height: 237,
            id: 39,
            name: 'Name1',
            rotation: 0,
            visible: true,
            width: 326,
            x: 40,
            y: 120
          },
          {
            type: 'ConversationArea',
            height: 266,
            id: 43,
            name: 'Name2',
            rotation: 0,
            visible: true,
            width: 467,
            x: 40,
            y: 120
          }
        ],
        opacity: 1,
        type: 'objectgroup',
        visible: true,
        x: 0,
        y: 0
      }
    ]
  },
  noObjects: {
    tiledversion: '1.9.0',
    tileheight: 32,
    tilesets: [],
    tilewidth: 32,
    type: 'map',
    layers: []
  },
  duplicateNames: {
    tiledversion: '1.9.0',
    tileheight: 32,
    tilesets: [],
    tilewidth: 32,
    type: 'map',
    layers: [
      {
        id: 4,
        name: 'Objects',
        objects: [
          {
            type: 'ConversationArea',
            height: 237,
            id: 39,
            name: 'Name1',
            rotation: 0,
            visible: true,
            width: 326,
            x: 40,
            y: 120
          },
          {
            type: 'ConversationArea',
            height: 266,
            id: 43,
            name: 'Name1',
            rotation: 0,
            visible: true,
            width: 467,
            x: 612,
            y: 120
          }
        ],
        opacity: 1,
        type: 'objectgroup',
        visible: true,
        x: 0,
        y: 0
      }
    ]
  },
  twoViewing: {
    tiledversion: '1.9.0',
    tileheight: 32,
    tilesets: [],
    tilewidth: 32,
    type: 'map',
    layers: [
      {
        id: 4,
        name: 'Objects',
        objects: [
          {
            type: 'ViewingArea',
            height: 237,
            id: 39,
            name: 'Name1',
            rotation: 0,
            visible: true,
            width: 326,
            x: 40,
            y: 120
          },
          {
            type: 'ViewingArea',
            height: 266,
            id: 43,
            name: 'Name2',
            rotation: 0,
            visible: true,
            width: 467,
            x: 612,
            y: 120
          }
        ],
        opacity: 1,
        type: 'objectgroup',
        visible: true,
        x: 0,
        y: 0
      }
    ]
  },
  twoConvOneViewing: {
    tiledversion: '1.9.0',
    tileheight: 32,
    tilesets: [],
    tilewidth: 32,
    type: 'map',
    layers: [
      {
        id: 4,
        name: 'Objects',
        objects: [
          {
            type: 'ConversationArea',
            height: 237,
            id: 39,
            name: 'Name1',
            rotation: 0,
            visible: true,
            width: 326,
            x: 40,
            y: 120
          },
          {
            type: 'ConversationArea',
            height: 266,
            id: 43,
            name: 'Name2',
            rotation: 0,
            visible: true,
            width: 467,
            x: 612,
            y: 120
          },
          {
            type: 'ViewingArea',
            height: 237,
            id: 54,
            name: 'Name3',
            properties: [
              {
                name: 'video',
                type: 'string',
                value: 'someURL'
              }
            ],
            rotation: 0,
            visible: true,
            width: 326,
            x: 155,
            y: 566
          }
        ],
        opacity: 1,
        type: 'objectgroup',
        visible: true,
        x: 0,
        y: 0
      }
    ]
  },
  twoConvTwoViewing: {
    tiledversion: '1.9.0',
    tileheight: 32,
    tilesets: [],
    tilewidth: 32,
    type: 'map',
    layers: [
      {
        id: 4,
        name: 'Objects',
        objects: [
          {
            type: 'ConversationArea',
            height: 237,
            id: 39,
            name: 'Name1',
            rotation: 0,
            visible: true,
            width: 326,
            x: 40,
            y: 120
          },
          {
            type: 'ConversationArea',
            height: 266,
            id: 43,
            name: 'Name2',
            rotation: 0,
            visible: true,
            width: 467,
            x: 612,
            y: 120
          },
          {
            type: 'ViewingArea',
            height: 237,
            id: 54,
            name: 'Name3',
            properties: [
              {
                name: 'video',
                type: 'string',
                value: 'someURL'
              }
            ],
            rotation: 0,
            visible: true,
            width: 326,
            x: 155,
            y: 566
          },
          {
            type: 'ViewingArea',
            height: 237,
            id: 55,
            name: 'Name4',
            properties: [
              {
                name: 'video',
                type: 'string',
                value: 'someURL'
              }
            ],
            rotation: 0,
            visible: true,
            width: 326,
            x: 600,
            y: 1200
          }
        ],
        opacity: 1,
        type: 'objectgroup',
        visible: true,
        x: 0,
        y: 0
      }
    ]
  }
}
describe('Town', () => {
  const townEmitter = mockDeep()
  let town
  let player
  let playerTestData
  beforeEach(async () => {
    town = new Town(nanoid(), false, nanoid(), townEmitter)
    playerTestData = mockPlayer(town.townID)
    player = await town.addPlayer(playerTestData.userName, playerTestData.socket)
    playerTestData.player = player
    playerTestData.moveTo(-1, -1)
    mockReset(townEmitter)
  })
  it('constructor should set its properties', () => {
    const townName = `FriendlyNameTest-${nanoid()}`
    const townID = nanoid()
    const testTown = new Town(townName, true, townID, townEmitter)
    expect(testTown.friendlyName).toBe(townName)
    expect(testTown.townID).toBe(townID)
    expect(testTown.isPubliclyListed).toBe(true)
  })
  describe('addPlayer', () => {
    it('should use the townID and player ID properties when requesting a video token', async () => {
      const newPlayer = mockPlayer(town.townID)
      mockTwilioVideo.getTokenForTown.mockClear()
      const newPlayerObj = await town.addPlayer(newPlayer.userName, newPlayer.socket)
      expect(mockTwilioVideo.getTokenForTown).toBeCalledTimes(1)
      expect(mockTwilioVideo.getTokenForTown).toBeCalledWith(town.townID, newPlayerObj.id)
    })
    it('should register callbacks for all client-to-server events', () => {
      const expectedEvents = [
        'disconnect',
        'chatMessage',
        'playerMovement',
        'interactableUpdate'
      ]
      expectedEvents.forEach(eachEvent => expect(getEventListener(playerTestData.socket, eachEvent)).toBeDefined())
    })
    describe('[T1] interactableUpdate callback', () => {
      let interactableUpdateHandler
      beforeEach(() => {
        town.initializeFromMap(testingMaps.twoConvTwoViewing)
        interactableUpdateHandler = getEventListener(playerTestData.socket, 'interactableUpdate')
      })
      it('Should not throw an error for any interactable area that is not a viewing area', () => {
        expect(() => interactableUpdateHandler({ id: 'Name1', topic: nanoid(), occupantsByID: [] })).not.toThrowError()
      })
      it('Should not throw an error if there is no such viewing area', () => {
        expect(() => interactableUpdateHandler({
          id: 'NotActuallyAnInteractable',
          topic: nanoid(),
          occupantsByID: []
        })).not.toThrowError()
      })
      describe('When called passing a valid viewing area', () => {
        let newArea
        let secondPlayer
        beforeEach(async () => {
          newArea = {
            id: 'Name4',
            elapsedTimeSec: 0,
            isPlaying: true,
            video: nanoid()
          }
          expect(town.addViewingArea(newArea)).toBe(true)
          secondPlayer = mockPlayer(town.townID)
          mockTwilioVideo.getTokenForTown.mockClear()
          await town.addPlayer(secondPlayer.userName, secondPlayer.socket)
          newArea.elapsedTimeSec = 100
          newArea.isPlaying = false
          mockClear(townEmitter)
          mockClear(secondPlayer.socket)
          mockClear(secondPlayer.socketToRoomMock)
          interactableUpdateHandler(newArea)
        })
        it("Should emit the interactable update to the other players in the town using the player's townEmitter, after the viewing area was successfully created", () => {
          const updatedArea = town.getInteractable(newArea.id)
          expect(updatedArea.toModel()).toEqual(newArea)
        })
        it('Should update the model for the viewing area', () => {
          const lastUpdate = getLastEmittedEvent(playerTestData.socketToRoomMock, 'interactableUpdate')
          expect(lastUpdate).toEqual(newArea)
        })
        it('Should not emit interactableUpdate events to players directly, or to the whole town', () => {
          expect(() => getLastEmittedEvent(playerTestData.socket, 'interactableUpdate')).toThrowError()
          expect(() => getLastEmittedEvent(townEmitter, 'interactableUpdate')).toThrowError()
          expect(() => getLastEmittedEvent(secondPlayer.socket, 'interactableUpdate')).toThrowError()
          expect(() => getLastEmittedEvent(secondPlayer.socketToRoomMock, 'interactableUpdate')).toThrowError()
        })
      })
    })
  })
  describe('Socket event listeners created in addPlayer', () => {
    describe('on socket disconnect', () => {
      function disconnectPlayer (playerToLeave) {
        const disconnectHandler = getEventListener(playerToLeave.socket, 'disconnect')
        disconnectHandler('unknown')
      }
      it("Invalidates the players's session token", async () => {
        const token = player.sessionToken
        expect(town.getPlayerBySessionToken(token)).toBe(player)
        disconnectPlayer(playerTestData)
        expect(town.getPlayerBySessionToken(token)).toEqual(undefined)
      })
      it('Informs all other players of the disconnection using the broadcast emitter', () => {
        const playerToLeaveID = player.id
        disconnectPlayer(playerTestData)
        const callToDisconnect = getLastEmittedEvent(townEmitter, 'playerDisconnect')
        expect(callToDisconnect.id).toEqual(playerToLeaveID)
      })
      it('Removes the player from any active conversation area', () => {
        town.initializeFromMap(testingMaps.twoConvOneViewing)
        playerTestData.moveTo(45, 122)
        expect(town.addConversationArea({ id: 'Name1', topic: 'test', occupantsByID: [] })).toBeTruthy()
        const convArea = town.getInteractable('Name1')
        expect(convArea.occupantsByID).toEqual([player.id])
        disconnectPlayer(playerTestData)
        expect(convArea.occupantsByID).toEqual([])
        expect(town.occupancy).toBe(0)
      })
      it('Removes the player from any active viewing area', () => {
        town.initializeFromMap(testingMaps.twoConvOneViewing)
        playerTestData.moveTo(156, 567)
        expect(town.addViewingArea({ id: 'Name3', isPlaying: true, elapsedTimeSec: 0, video: nanoid() })).toBeTruthy()
        const viewingArea = town.getInteractable('Name3')
        expect(viewingArea.occupantsByID).toEqual([player.id])
        disconnectPlayer(playerTestData)
        expect(viewingArea.occupantsByID).toEqual([])
      })
    })
    describe('playerMovement', () => {
      const newLocation = {
        x: 100,
        y: 100,
        rotation: 'back',
        moving: true
      }
      beforeEach(() => {
        playerTestData.moveTo(newLocation.x, newLocation.y, newLocation.rotation, newLocation.moving)
      })
      it('Emits a playerMoved event', () => {
        const lastEmittedMovement = getLastEmittedEvent(townEmitter, 'playerMoved')
        expect(lastEmittedMovement.id).toEqual(playerTestData.player?.id)
        expect(lastEmittedMovement.location).toEqual(newLocation)
      })
      it("Updates the player's location", () => {
        expect(player.location).toEqual(newLocation)
      })
    })
    describe('interactableUpdate', () => {
      let interactableUpdateCallback
      let update
      beforeEach(async () => {
        town.initializeFromMap(testingMaps.twoConvOneViewing)
        playerTestData.moveTo(156, 567)
        interactableUpdateCallback = getEventListener(playerTestData.socket, 'interactableUpdate')
        update = {
          id: 'Name3',
          isPlaying: true,
          elapsedTimeSec: 100,
          video: nanoid()
        }
        interactableUpdateCallback(update)
      })
      it('forwards updates to others in the town', () => {
        const lastEvent = getLastEmittedEvent(playerTestData.socketToRoomMock, 'interactableUpdate')
        expect(lastEvent).toEqual(update)
      })
      it('does not forward updates to the ENTIRE town', () => {
        expect(() => getLastEmittedEvent(townEmitter, 'interactableUpdate')).toThrowError()
      })
      it('updates the local model for that interactable', () => {
        const interactable = town.getInteractable(update.id)
        expect(interactable?.toModel()).toEqual(update)
      })
    })
    it('Forwards chat messages to players with the same ID as the message ID', async () => {
      const chatHandler = getEventListener(playerTestData.socket, 'chatMessage')
      const chatMessage = {
        author: player.id,
        body: 'Test message',
        dateCreated: new Date(),
        sid: 'test message id',
        interactableId: player.location?.interactableID
      }
      chatHandler(chatMessage)
      const emittedMessage = getLastEmittedEvent(playerTestData.socket, 'chatMessage')
      expect(emittedMessage).toEqual(chatMessage)
    })
    it('Does not forward chat messages to players if the message ID doesnt match the player area', async () => {
      const chatHandler = getEventListener(playerTestData.socket, 'chatMessage')
      const chatMessage = {
        author: player.id,
        body: 'Test message',
        dateCreated: new Date(),
        sid: 'test message id',
        interactableId: 'random id'
      }
      chatHandler(chatMessage)
      expect(() => {
        getLastEmittedEvent(playerTestData.socket, 'chatMessage')
      }).toThrowError()
    })
  })
  describe('addConversationArea', () => {
    beforeEach(async () => {
      town.initializeFromMap(testingMaps.twoConvOneViewing)
    })
    it('Should return false if no area exists with that ID', () => {
      expect(town.addConversationArea({ id: nanoid(), topic: nanoid(), occupantsByID: [] })).toEqual(false)
    })
    it('Should return false if the requested topic is empty', () => {
      expect(town.addConversationArea({ id: 'Name1', topic: '', occupantsByID: [] })).toEqual(false)
      expect(town.addConversationArea({ id: 'Name1', topic: undefined, occupantsByID: [] })).toEqual(false)
    })
    it('Should return false if the area already has a topic', () => {
      expect(town.addConversationArea({ id: 'Name1', topic: 'new topic', occupantsByID: [] })).toEqual(true)
      expect(town.addConversationArea({ id: 'Name1', topic: 'new new topic', occupantsByID: [] })).toEqual(false)
    })
    describe('When successful', () => {
      const newTopic = 'new topic'
      beforeEach(() => {
        playerTestData.moveTo(45, 122)
        expect(town.addConversationArea({ id: 'Name1', topic: newTopic, occupantsByID: [] })).toEqual(true)
      })
      it('Should update the local model for that area', () => {
        const convArea = town.getInteractable('Name1')
        expect(convArea.topic).toEqual(newTopic)
      })
      it('Should include any players in that area as occupants', () => {
        const convArea = town.getInteractable('Name1')
        expect(convArea.occupantsByID).toEqual([player.id])
      })
      it('Should emit an interactableUpdate message', () => {
        const lastEmittedUpdate = getLastEmittedEvent(townEmitter, 'interactableUpdate')
        expect(lastEmittedUpdate).toEqual({
          id: 'Name1',
          topic: newTopic,
          occupantsByID: [player.id]
        })
      })
    })
  })
  describe('[T1] addViewingArea', () => {
    beforeEach(async () => {
      town.initializeFromMap(testingMaps.twoConvOneViewing)
    })
    it('Should return false if no area exists with that ID', () => {
      expect(town.addViewingArea({ id: nanoid(), isPlaying: false, elapsedTimeSec: 0, video: nanoid() })).toBe(false)
    })
    it('Should return false if the requested video is empty', () => {
      expect(town.addViewingArea({ id: 'Name3', isPlaying: false, elapsedTimeSec: 0, video: '' })).toBe(false)
      expect(town.addViewingArea({ id: 'Name3', isPlaying: false, elapsedTimeSec: 0, video: undefined })).toBe(false)
    })
    it('Should return false if the area is already active', () => {
      expect(town.addViewingArea({ id: 'Name3', isPlaying: false, elapsedTimeSec: 0, video: 'test' })).toBe(true)
      expect(town.addViewingArea({ id: 'Name3', isPlaying: false, elapsedTimeSec: 0, video: 'test2' })).toBe(false)
    })
    describe('When successful', () => {
      const newModel = {
        id: 'Name3',
        isPlaying: true,
        elapsedTimeSec: 100,
        video: nanoid()
      }
      beforeEach(() => {
        playerTestData.moveTo(160, 570)
        expect(town.addViewingArea(newModel)).toBe(true)
      })
      it('Should update the local model for that area', () => {
        const viewingArea = town.getInteractable('Name3')
        expect(viewingArea.toModel()).toEqual(newModel)
      })
      it('Should emit an interactableUpdate message', () => {
        const lastEmittedUpdate = getLastEmittedEvent(townEmitter, 'interactableUpdate')
        expect(lastEmittedUpdate).toEqual(newModel)
      })
      it('Should include any players in that area as occupants', () => {
        const viewingArea = town.getInteractable('Name3')
        expect(viewingArea.occupantsByID).toEqual([player.id])
      })
    })
  })
  describe('disconnectAllPlayers', () => {
    beforeEach(() => {
      town.disconnectAllPlayers()
    })
    it('Should emit the townClosing event', () => {
      getLastEmittedEvent(townEmitter, 'townClosing')
    })
    it("Should disconnect each players's socket", () => {
      expect(playerTestData.socket.disconnect).toBeCalledWith(true)
    })
  })
  describe('initializeFromMap', () => {
    const expectInitializingFromMapToThrowError = (map) => {
      expect(() => town.initializeFromMap(map)).toThrowError()
    }
    it('Throws an error if there is no layer called "objects"', async () => {
      expectInitializingFromMapToThrowError(testingMaps.noObjects)
    })
    it('Throws an error if there are duplicate interactable object IDs', async () => {
      expectInitializingFromMapToThrowError(testingMaps.duplicateNames)
    })
    it('Throws an error if there are overlapping objects', async () => {
      expectInitializingFromMapToThrowError(testingMaps.overlapping)
    })
    it('Creates a ConversationArea instance for each region on the map', async () => {
      town.initializeFromMap(testingMaps.twoConv)
      const conv1 = town.getInteractable('Name1')
      const conv2 = town.getInteractable('Name2')
      expect(conv1.id).toEqual('Name1')
      expect(conv1.boundingBox).toEqual({ x: 40, y: 120, height: 237, width: 326 })
      expect(conv2.id).toEqual('Name2')
      expect(conv2.boundingBox).toEqual({ x: 612, y: 120, height: 266, width: 467 })
      expect(town.interactables.length).toBe(2)
    })
    it('Creates a ViewingArea instance for each region on the map', async () => {
      town.initializeFromMap(testingMaps.twoViewing)
      const viewingArea1 = town.getInteractable('Name1')
      const viewingArea2 = town.getInteractable('Name2')
      expect(viewingArea1.id).toEqual('Name1')
      expect(viewingArea1.boundingBox).toEqual({ x: 40, y: 120, height: 237, width: 326 })
      expect(viewingArea2.id).toEqual('Name2')
      expect(viewingArea2.boundingBox).toEqual({ x: 612, y: 120, height: 266, width: 467 })
      expect(town.interactables.length).toBe(2)
    })
    describe('Updating interactable state in playerMovements', () => {
      beforeEach(async () => {
        town.initializeFromMap(testingMaps.twoConvOneViewing)
        playerTestData.moveTo(51, 121)
        expect(town.addConversationArea({ id: 'Name1', topic: 'test', occupantsByID: [] })).toBe(true)
      })
      it('Adds a player to a new interactable and sets their conversation label, if they move into it', async () => {
        const newPlayer = mockPlayer(town.townID)
        const newPlayerObj = await town.addPlayer(newPlayer.userName, newPlayer.socket)
        newPlayer.moveTo(51, 121)
        expect(newPlayerObj.location.interactableID).toEqual('Name1')
        const lastEmittedMovement = getLastEmittedEvent(townEmitter, 'playerMoved')
        expect(lastEmittedMovement.location.interactableID).toEqual('Name1')
        const occupants = town.getInteractable('Name1').occupantsByID
        expectArraysToContainSameMembers(occupants, [newPlayerObj.id, player.id])
      })
      it('Removes a player from their prior interactable and sets their conversation label, if they moved outside of it', () => {
        expect(player.location.interactableID).toEqual('Name1')
        playerTestData.moveTo(0, 0)
        expect(player.location.interactableID).toBeUndefined()
      })
    })
  })
  describe('Updating town settings', () => {
    it('Emits townSettingsUpdated events when friendlyName changes', async () => {
      const newFriendlyName = nanoid()
      town.friendlyName = newFriendlyName
      expect(townEmitter.emit).toBeCalledWith('townSettingsUpdated', {
        friendlyName: newFriendlyName
      })
    })
    it('Emits townSettingsUpdated events when isPubliclyListed changes', async () => {
      const expected = !town.isPubliclyListed
      town.isPubliclyListed = expected
      expect(townEmitter.emit).toBeCalledWith('townSettingsUpdated', {
        isPubliclyListed: expected
      })
    })
  })
})
// # sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVG93bi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Rvd24vVG93bi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBaUIsU0FBUyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNuRixPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBR2hDLE9BQU8sV0FBVyxNQUFNLG9CQUFvQixDQUFDO0FBQzdDLE9BQU8sRUFFTCxnQ0FBZ0MsRUFDaEMsZ0JBQWdCLEVBQ2hCLG1CQUFtQixFQUVuQixVQUFVLEdBQ1gsTUFBTSxjQUFjLENBQUM7QUFTdEIsT0FBTyxJQUFJLE1BQU0sUUFBUSxDQUFDO0FBRTFCLE1BQU0sZUFBZSxHQUFHLFFBQVEsRUFBZSxDQUFDO0FBQ2hELElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLGFBQWEsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUt4RSxNQUFNLFdBQVcsR0FBZ0I7SUFDL0IsT0FBTyxFQUFFO1FBQ1AsWUFBWSxFQUFFLE9BQU87UUFDckIsVUFBVSxFQUFFLEVBQUU7UUFDZCxRQUFRLEVBQUUsRUFBRTtRQUNaLFNBQVMsRUFBRSxFQUFFO1FBQ2IsSUFBSSxFQUFFLEtBQUs7UUFDWCxNQUFNLEVBQUU7WUFDTjtnQkFDRSxFQUFFLEVBQUUsQ0FBQztnQkFDTCxJQUFJLEVBQUUsU0FBUztnQkFDZixPQUFPLEVBQUU7b0JBQ1A7d0JBQ0UsSUFBSSxFQUFFLGtCQUFrQjt3QkFDeEIsTUFBTSxFQUFFLEdBQUc7d0JBQ1gsRUFBRSxFQUFFLEVBQUU7d0JBQ04sSUFBSSxFQUFFLE9BQU87d0JBQ2IsUUFBUSxFQUFFLENBQUM7d0JBQ1gsT0FBTyxFQUFFLElBQUk7d0JBQ2IsS0FBSyxFQUFFLEdBQUc7d0JBQ1YsQ0FBQyxFQUFFLEVBQUU7d0JBQ0wsQ0FBQyxFQUFFLEdBQUc7cUJBQ1A7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
