import InteractableArea from './InteractableArea'
export default class PosterSessionArea extends InteractableArea {
  get stars () {
    throw new Error('Not implemented')
  }

  get title () {
    throw new Error('Not implemented')
  }

  get imageContents () {
    throw new Error('Not implemented')
  }

  constructor ({ id, stars, imageContents, title }, coordinates, townEmitter) {
    super(id, coordinates, townEmitter)
  }

  remove (player) {
    throw new Error('Not implemented')
  }

  updateModel (updatedModel) {
    throw new Error('Not implemented')
  }

  toModel () {
    throw new Error('Not implemented')
  }

  static fromMapObject (mapObject, townEmitter) {
    throw new Error('Not implemented')
  }
}
// # sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUG9zdGVyU2Vzc2lvbkFyZWEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdG93bi9Qb3N0ZXJTZXNzaW9uQXJlYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFPQSxPQUFPLGdCQUFnQixNQUFNLG9CQUFvQixDQUFDO0FBRWxELE1BQU0sQ0FBQyxPQUFPLE9BQU8saUJBQWtCLFNBQVEsZ0JBQWdCO0lBRTdELElBQVcsS0FBSztRQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQsSUFBVyxLQUFLO1FBQ2QsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxJQUFXLGFBQWE7UUFDdEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFTRCxZQUNFLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUEwQixFQUMzRCxXQUF3QixFQUN4QixXQUF3QjtRQUV4QixLQUFLLENBQUMsRUFBRSxFQUFFLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUV0QyxDQUFDO0lBU00sTUFBTSxDQUFDLE1BQWM7UUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFPTSxXQUFXLENBQUMsWUFBb0M7UUFDckQsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFNTSxPQUFPO1FBQ1osTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFRTSxNQUFNLENBQUMsYUFBYSxDQUN6QixTQUEwQixFQUMxQixXQUF3QjtRQUV4QixNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDckMsQ0FBQztDQUNGIn0=
