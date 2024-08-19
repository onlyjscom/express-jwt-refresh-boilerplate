import createError from 'http-errors';

/*
We will add "Exception" suffix to avoid conflict with the built-in types of http-errors because we will export them as well.
This also standardizes the naming convention of the exceptions, so we can write "Exception" to filter out all exceptions
in the IDE when importing
*/

const BadRequestException = createError.BadRequest;
const UnauthorizedException = createError.Unauthorized;
const PaymentRequiredException = createError.PaymentRequired;
const ForbiddenException = createError.Forbidden;
const NotFoundException = createError.NotFound;
const MethodNotAllowedException = createError.MethodNotAllowed;
const NotAcceptableException = createError.NotAcceptable;
const ProxyAuthenticationRequiredException = createError.ProxyAuthenticationRequired;
const RequestTimeoutException = createError.RequestTimeout;
const ConflictException = createError.Conflict;
const GoneException = createError.Gone;
const LengthRequiredException = createError.LengthRequired;
const PreconditionFailedException = createError.PreconditionFailed;
const PayloadTooLargeException = createError.PayloadTooLarge;
const URITooLongException = createError.URITooLong;
const UnsupportedMediaTypeException = createError.UnsupportedMediaType;
const RangeNotSatisfiableException = createError.RangeNotSatisfiable;
const ExpectationFailedException = createError.ExpectationFailed;
const ImATeapotException = createError.ImATeapot;
const MisdirectedRequestException = createError.MisdirectedRequest;
const UnprocessableEntityException = createError.UnprocessableEntity;
const LockedException = createError.Locked;
const FailedDependencyException = createError.FailedDependency;
const TooEarlyException = createError.TooEarly;
const UpgradeRequiredException = createError.UpgradeRequired;
const PreconditionRequiredException = createError.PreconditionRequired;
const TooManyRequestsException = createError.TooManyRequests;
const RequestHeaderFieldsTooLargeException = createError.RequestHeaderFieldsTooLarge;
const UnavailableForLegalReasonsException = createError.UnavailableForLegalReasons;
const InternalServerErrorException = createError.InternalServerError;
const NotImplementedException = createError.NotImplemented;
const BadGatewayException = createError.BadGateway;
const ServiceUnavailableException = createError.ServiceUnavailable;
const GatewayTimeoutException = createError.GatewayTimeout;
const HTTPVersionNotSupportedException = createError.HTTPVersionNotSupported;
const VariantAlsoNegotiatesException = createError.VariantAlsoNegotiates;
const InsufficientStorageException = createError.InsufficientStorage;
const LoopDetectedException = createError.LoopDetected;
const BandwidthLimitExceededException = createError.BandwidthLimitExceeded;
const NotExtendedException = createError.NotExtended;
const NetworkAuthenticationRequireException = createError.NetworkAuthenticationRequire;


export {
    BadRequestException,
    UnauthorizedException,
    PaymentRequiredException,
    ForbiddenException,
    NotFoundException,
    MethodNotAllowedException,
    NotAcceptableException,
    ProxyAuthenticationRequiredException,
    RequestTimeoutException,
    ConflictException,
    GoneException,
    LengthRequiredException,
    PreconditionFailedException,
    PayloadTooLargeException,
    URITooLongException,
    UnsupportedMediaTypeException,
    RangeNotSatisfiableException,
    ExpectationFailedException,
    ImATeapotException,
    MisdirectedRequestException,
    UnprocessableEntityException,
    LockedException,
    FailedDependencyException,
    TooEarlyException,
    UpgradeRequiredException,
    PreconditionRequiredException,
    TooManyRequestsException,
    RequestHeaderFieldsTooLargeException,
    UnavailableForLegalReasonsException,
    InternalServerErrorException,
    NotImplementedException,
    BadGatewayException,
    ServiceUnavailableException,
    GatewayTimeoutException,
    HTTPVersionNotSupportedException,
    VariantAlsoNegotiatesException,
    InsufficientStorageException,
    LoopDetectedException,
    BandwidthLimitExceededException,
    NotExtendedException,
    NetworkAuthenticationRequireException,
};

// @ts-ignore
export * from 'http-errors';
