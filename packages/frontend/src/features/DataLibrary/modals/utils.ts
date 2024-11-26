export const HTTPUserFriendlyErrorMessages: Record<number, string> = {
  // 4xx Client Errors
  400: 'Sorry, there was a problem with your request. Please check the information you provided and try again.',
  401: 'Please sign in to continue. Your session may have expired.',
  402: 'This feature requires payment to continue. Please update your subscription.',
  403: "You don't have permission to access this. If you think this is a mistake, please contact support.",
  404: "We couldn't find what you're looking for. The link might be broken or the content may have been moved.",
  405: 'This action is not supported. Please try a different approach.',
  406: "Your browser sent a request that this server couldn't understand. Try updating your browser.",
  407: 'Please authenticate with the network proxy first.',
  408: 'The request took too long to complete. Please check your internet connection and try again.',
  409: 'There was a conflict with your request. Someone might have modified the same content.',
  410: 'This content has been permanently removed and is no longer available.',
  411: 'There was a technical problem with your request. Please try again.',
  412: "Some conditions for this request weren't met. Please try again.",
  413: "The file you're trying to upload is too large. Please choose a smaller file.",
  414: 'The web address is too long. Please try a shorter URL.',
  415: 'This type of file is not supported. Please try a different format.',
  416: 'The requested content range is not available.',
  417: "Your request couldn't be completed as expected. Please try again.",
  418: 'Unusual error occurred. Please try again or contact support if the problem persists.',
  421: 'Your request was sent to the wrong server. Please try again.',
  422: "We couldn't process your request. Please check the information and try again.",
  423: 'This resource is temporarily locked. Please try again in a few moments.',
  424: 'The request failed because it depends on another request that failed.',
  425: 'Your request was processed too early. Please try again in a moment.',
  426: 'You need to upgrade your browser or app to continue.',
  428: "Some required conditions weren't met. Please check all requirements and try again.",
  429: "You've made too many requests. Please wait a while before trying again.",
  431: 'Request failed because the headers are too large. Please simplify your request.',
  451: 'This content is not available for legal reasons.',

  // 5xx Server Errors
  500: "Something went wrong on our end. We're working to fix it. Please try again later.",
  501: "This feature isn't available yet. Check back later.",
  502: "We're having trouble connecting to our servers. Please try again in a few minutes.",
  503: "Our service is temporarily unavailable. We're working to restore it as quickly as possible.",
  504: 'The server took too long to respond. Please try again later.',
  505: "Your browser's HTTP version isn't supported. Please try updating your browser.",
  506: 'We encountered a configuration error.',
  507: "We're out of storage space.",
  508: 'We detected an infinite loop in our servers.',
  510: 'This server requires additional extensions to process your request.',
  511: 'Please sign in to the network before continuing.',
};
