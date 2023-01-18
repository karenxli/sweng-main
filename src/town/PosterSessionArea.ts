import { ITiledMapObject } from '@jonbell/tiled-map-type-guard';
import Player from '../lib/Player';
import {
  BoundingBox,
  TownEmitter,
  PosterSessionArea as PosterSessionAreaModel,
} from '../types/CoveyTownSocket';
import InteractableArea from './InteractableArea';
import e from 'express';

export default class PosterSessionArea extends InteractableArea {

  // add fields
  private _poster?: string;
  private _stars: number;
  private _title?: string;

  private _coordinates: BoundingBox;
  /* An emitter that can be used to broadcast messages to all players in this town */


  public get stars() {
    return this._stars;
  }

  public get title() {
    return this._title;
  }

  public get imageContents() {
    return this._poster;
  }

  public get coordinates() {
    return this._coordinates;
  }

  /**
   * Creates a new PosterSessionArea
   *
   * @param viewingArea model containing this area's starting state
   * @param coordinates the bounding box that defines this viewing area
   * @param townEmitter a broadcast emitter that can be used to emit updates to players
   */
  public constructor(
    { id, stars, imageContents, title }: PosterSessionAreaModel,
    coordinates: BoundingBox,
    townEmitter: TownEmitter,

  ) {
    super(id, coordinates, townEmitter);
    // extends Interactable Area
    // fill in
    this._poster = imageContents;
    if(stars < 0) {
      throw new Error("Invalid number of stars!");
    }
    else this._stars = stars;
    this._title = title;
    this._coordinates = coordinates;
  }

  /**
   * Removes a player from this poster session area.
   *
   * When the last player leaves, this method clears the poster and title, and resets the number of stars, and emits this update to all players in the Town.
   *
   * @param player
   */
  public remove(player: Player): void {
    super.remove(player);
    if (this._occupants.length === 0) {
      this._stars = 0;
      this._poster = undefined;
      this._title = undefined;
      this._emitAreaChanged();
    }
  }

  /**
   * Increments the number of stars in a poster session area by 1.
   */
  public incrementStars(): void {
    this._stars += 1;
  }
  /**
   * Updates the state of this PosterSessionArea, setting the poster, title, and stars properties
   *
   * @param posterSessionArea updated model
   */
  public updateModel(updatedModel: PosterSessionAreaModel) {
    this._poster = updatedModel.imageContents;
    this._stars = updatedModel.stars;
    this._title = updatedModel.title;
  }

  /**
   * Convert this PosterSessionArea instance to a simple PosterSessionAreaModel suitable for
   * transporting over a socket to a client (i.e., serializable).
   */
  public toModel(): PosterSessionAreaModel {
    return {
      id: this.id,
      stars: this._stars,
      imageContents: this._poster,
      title: this._title
    };
  }

  /**
   * Creates a new PosterSessionArea object that will represent a PosterSessionArea object in the town map.
   * @param mapObject An ITiledMapObject that represents a rectangle in which this viewing area exists
   * @param townEmitter An emitter that can be used by this viewing area to broadcast updates to players in the town
   * @returns
   */
  public static fromMapObject(
    mapObject: ITiledMapObject,
    townEmitter: TownEmitter,
  ): PosterSessionArea {
  const { name, width, height } = mapObject;
    if (!width || !height) {
      throw new Error(`Malformed viewing area ${name}`);
    }
    const rect: BoundingBox = { x: mapObject.x, y: mapObject.y, width, height };
    return new PosterSessionArea({id: name, stars: 0}, rect, townEmitter);
  }
}
