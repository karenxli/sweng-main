import { ValidationService, ValidateError, fetchMiddlewares } from '@tsoa/runtime'
import { TownsController } from './../src/town/TownsController'
const models = {
  Town: {
    dataType: 'refObject',
    properties: {
      friendlyName: { dataType: 'string', required: true },
      townID: { dataType: 'string', required: true },
      currentOccupancy: { dataType: 'double', required: true },
      maximumOccupancy: { dataType: 'double', required: true }
    },
    additionalProperties: false
  },
  TownCreateResponse: {
    dataType: 'refObject',
    properties: {
      townID: { dataType: 'string', required: true },
      townUpdatePassword: { dataType: 'string', required: true }
    },
    additionalProperties: false
  },
  TownCreateParams: {
    dataType: 'refObject',
    properties: {
      friendlyName: { dataType: 'string', required: true },
      isPubliclyListed: { dataType: 'boolean', required: true },
      mapFile: { dataType: 'string' }
    },
    additionalProperties: false
  },
  InvalidParametersError: {
    dataType: 'refObject',
    properties: {
      code: { dataType: 'undefined', required: true },
      message: { dataType: 'string', required: true }
    },
    additionalProperties: false
  },
  TownSettingsUpdate: {
    dataType: 'refAlias',
    type: { dataType: 'nestedObjectLiteral', nestedProperties: { isPubliclyListed: { dataType: 'boolean' }, friendlyName: { dataType: 'string' } }, validators: {} }
  },
  ConversationArea: {
    dataType: 'refObject',
    properties: {
      id: { dataType: 'string', required: true },
      topic: { dataType: 'string' },
      occupantsByID: { dataType: 'array', array: { dataType: 'string' }, required: true }
    },
    additionalProperties: false
  },
  ViewingArea: {
    dataType: 'refObject',
    properties: {
      id: { dataType: 'string', required: true },
      video: { dataType: 'string' },
      isPlaying: { dataType: 'boolean', required: true },
      progress: { dataType: 'double', required: true }
    },
    additionalProperties: false
  }
}
const validationService = new ValidationService(models)
export function RegisterRoutes (app) {
  app.get('/towns', ...(fetchMiddlewares(TownsController)), ...(fetchMiddlewares(TownsController.prototype.listTowns)), function TownsController_listTowns (request, response, next) {
    const args = {}
    let validatedArgs = []
    try {
      validatedArgs = getValidatedArgs(args, request, response)
      const controller = new TownsController()
      const promise = controller.listTowns.apply(controller, validatedArgs)
      promiseHandler(controller, promise, response, undefined, next)
    } catch (err) {
      return next(err)
    }
  })
  app.post('/towns', ...(fetchMiddlewares(TownsController)), ...(fetchMiddlewares(TownsController.prototype.createTown)), function TownsController_createTown (request, response, next) {
    const args = {
      request: { in: 'body', name: 'request', required: true, ref: 'TownCreateParams' }
    }
    let validatedArgs = []
    try {
      validatedArgs = getValidatedArgs(args, request, response)
      const controller = new TownsController()
      const promise = controller.createTown.apply(controller, validatedArgs)
      promiseHandler(controller, promise, response, undefined, next)
    } catch (err) {
      return next(err)
    }
  })
  app.patch('/towns/:townID', ...(fetchMiddlewares(TownsController)), ...(fetchMiddlewares(TownsController.prototype.updateTown)), function TownsController_updateTown (request, response, next) {
    const args = {
      townID: { in: 'path', name: 'townID', required: true, dataType: 'string' },
      townUpdatePassword: { in: 'header', name: 'X-CoveyTown-Password', required: true, dataType: 'string' },
      requestBody: { in: 'body', name: 'requestBody', required: true, ref: 'TownSettingsUpdate' }
    }
    let validatedArgs = []
    try {
      validatedArgs = getValidatedArgs(args, request, response)
      const controller = new TownsController()
      const promise = controller.updateTown.apply(controller, validatedArgs)
      promiseHandler(controller, promise, response, undefined, next)
    } catch (err) {
      return next(err)
    }
  })
  app.delete('/towns/:townID', ...(fetchMiddlewares(TownsController)), ...(fetchMiddlewares(TownsController.prototype.deleteTown)), function TownsController_deleteTown (request, response, next) {
    const args = {
      townID: { in: 'path', name: 'townID', required: true, dataType: 'string' },
      townUpdatePassword: { in: 'header', name: 'X-CoveyTown-Password', required: true, dataType: 'string' }
    }
    let validatedArgs = []
    try {
      validatedArgs = getValidatedArgs(args, request, response)
      const controller = new TownsController()
      const promise = controller.deleteTown.apply(controller, validatedArgs)
      promiseHandler(controller, promise, response, undefined, next)
    } catch (err) {
      return next(err)
    }
  })
  app.post('/towns/:townID/conversationArea', ...(fetchMiddlewares(TownsController)), ...(fetchMiddlewares(TownsController.prototype.createConversationArea)), function TownsController_createConversationArea (request, response, next) {
    const args = {
      townID: { in: 'path', name: 'townID', required: true, dataType: 'string' },
      sessionToken: { in: 'header', name: 'X-Session-Token', required: true, dataType: 'string' },
      requestBody: { in: 'body', name: 'requestBody', required: true, ref: 'ConversationArea' }
    }
    let validatedArgs = []
    try {
      validatedArgs = getValidatedArgs(args, request, response)
      const controller = new TownsController()
      const promise = controller.createConversationArea.apply(controller, validatedArgs)
      promiseHandler(controller, promise, response, undefined, next)
    } catch (err) {
      return next(err)
    }
  })
  app.post('/towns/:townID/viewingArea', ...(fetchMiddlewares(TownsController)), ...(fetchMiddlewares(TownsController.prototype.createViewingArea)), function TownsController_createViewingArea (request, response, next) {
    const args = {
      townID: { in: 'path', name: 'townID', required: true, dataType: 'string' },
      sessionToken: { in: 'header', name: 'X-Session-Token', required: true, dataType: 'string' },
      requestBody: { in: 'body', name: 'requestBody', required: true, ref: 'ViewingArea' }
    }
    let validatedArgs = []
    try {
      validatedArgs = getValidatedArgs(args, request, response)
      const controller = new TownsController()
      const promise = controller.createViewingArea.apply(controller, validatedArgs)
      promiseHandler(controller, promise, response, undefined, next)
    } catch (err) {
      return next(err)
    }
  })
  function isController (object) {
    return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object
  }
  function promiseHandler (controllerObj, promise, response, successStatus, next) {
    return Promise.resolve(promise)
      .then((data) => {
        let statusCode = successStatus
        let headers
        if (isController(controllerObj)) {
          headers = controllerObj.getHeaders()
          statusCode = controllerObj.getStatus() || statusCode
        }
        returnHandler(response, statusCode, data, headers)
      })
      .catch((error) => next(error))
  }
  function returnHandler (response, statusCode, data, headers = {}) {
    if (response.headersSent) {
      return
    }
    Object.keys(headers).forEach((name) => {
      response.set(name, headers[name])
    })
    if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
      data.pipe(response)
    } else if (data !== null && data !== undefined) {
      response.status(statusCode || 200).json(data)
    } else {
      response.status(statusCode || 204).end()
    }
  }
  function responder (response) {
    return function (status, data, headers) {
      returnHandler(response, status, data, headers)
    }
  }
  ;
  function getValidatedArgs (args, request, response) {
    const fieldErrors = {}
    const values = Object.keys(args).map((key) => {
      const name = args[key].name
      switch (args[key].in) {
        case 'request':
          return request
        case 'query':
          return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, { noImplicitAdditionalProperties: 'throw-on-extras' })
        case 'path':
          return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, { noImplicitAdditionalProperties: 'throw-on-extras' })
        case 'header':
          return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, { noImplicitAdditionalProperties: 'throw-on-extras' })
        case 'body':
          return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, { noImplicitAdditionalProperties: 'throw-on-extras' })
        case 'body-prop':
          return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', { noImplicitAdditionalProperties: 'throw-on-extras' })
        case 'formData':
          if (args[key].dataType === 'file') {
            return validationService.ValidateParam(args[key], request.file, name, fieldErrors, undefined, { noImplicitAdditionalProperties: 'throw-on-extras' })
          } else if (args[key].dataType === 'array' && args[key].array.dataType === 'file') {
            return validationService.ValidateParam(args[key], request.files, name, fieldErrors, undefined, { noImplicitAdditionalProperties: 'throw-on-extras' })
          } else {
            return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, undefined, { noImplicitAdditionalProperties: 'throw-on-extras' })
          }
        case 'res':
          return responder(response)
      }
    })
    if (Object.keys(fieldErrors).length > 0) {
      throw new ValidateError(fieldErrors, '')
    }
    return values
  }
}
// # sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vZ2VuZXJhdGVkL3JvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxPQUFPLEVBQWMsaUJBQWlCLEVBQWUsYUFBYSxFQUFrRCxnQkFBZ0IsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU1SixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFNaEUsTUFBTSxNQUFNLEdBQXFCO0lBQzdCLE1BQU0sRUFBRTtRQUNKLFVBQVUsRUFBRSxXQUFXO1FBQ3ZCLFlBQVksRUFBRTtZQUNWLGNBQWMsRUFBRSxFQUFDLFVBQVUsRUFBQyxRQUFRLEVBQUMsVUFBVSxFQUFDLElBQUksRUFBQztZQUNyRCxRQUFRLEVBQUUsRUFBQyxVQUFVLEVBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxJQUFJLEVBQUM7WUFDL0Msa0JBQWtCLEVBQUUsRUFBQyxVQUFVLEVBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxJQUFJLEVBQUM7WUFDekQsa0JBQWtCLEVBQUUsRUFBQyxVQUFVLEVBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxJQUFJLEVBQUM7U0FDNUQ7UUFDRCxzQkFBc0IsRUFBRSxLQUFLO0tBQ2hDO0lBRUQsb0JBQW9CLEVBQUU7UUFDbEIsVUFBVSxFQUFFLFdBQVc7UUFDdkIsWUFBWSxFQUFFO1lBQ1YsUUFBUSxFQUFFLEVBQUMsVUFBVSxFQUFDLFFBQVEsRUFBQyxVQUFVLEVBQUMsSUFBSSxFQUFDO1lBQy9DLG9CQUFvQixFQUFFLEVBQUMsVUFBVSxFQUFDLFFBQVEsRUFBQyxVQUFVLEVBQUMsSUFBSSxFQUFDO1NBQzlEO1FBQ0Qsc0JBQXNCLEVBQUUsS0FBSztLQUNoQztJQUVELGtCQUFrQixFQUFFO1FBQ2hCLFVBQVUsRUFBRSxXQUFXO1FBQ3ZCLFlBQVksRUFBRTtZQUNWLGNBQWMsRUFBRSxFQUFDLFVBQVUsRUFBQyxRQUFRLEVBQUMsVUFBVSxFQUFDLElBQUksRUFBQztZ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
