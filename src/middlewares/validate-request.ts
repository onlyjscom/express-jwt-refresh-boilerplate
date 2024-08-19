import { ZodError, ZodIssue, ZodIssueCode, ZodSchema } from 'zod';
import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

export function validateRequest<Schema extends ZodSchema>(schema: Schema): RequestHandler {
    return (req, res, next) => {
        try {
            // Filter out undefined keys
            const parsedRequest = {
                body: req.body || {},
                query: req.query || {},
                params: req.params || {},
            };
            const filteredRequest = Object.fromEntries(
                Object.entries(parsedRequest).filter(([, value]) => Object.keys(value).length > 0),
            );

            schema.parse(filteredRequest);

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((issue: ZodIssue) => {
                    const path = issue.path.join('.');
                    let message;

                    switch (issue.code) {
                        case ZodIssueCode.invalid_type:
                            message = `${path} should be of type ${issue.expected}`;
                            break;
                        case ZodIssueCode.invalid_literal:
                            message = `${path} should be the literal value: ${issue.expected}`;
                            break;
                        case ZodIssueCode.unrecognized_keys:
                            const keys = issue.keys.join(', ');
                            message = `${path} contains unrecognized key(s): ${keys}`;
                            break;
                        case ZodIssueCode.invalid_union:
                            message = `${path} is invalid for all possible types`;
                            break;
                        case ZodIssueCode.invalid_union_discriminator:
                            message = `${path} has an invalid union discriminator value`;
                            break;
                        case ZodIssueCode.invalid_enum_value:
                            message = `${path} should be one of: ${issue.options.join(', ')}`;
                            break;
                        case ZodIssueCode.invalid_arguments:
                            message = `${path} has invalid arguments: ${issue.message}`;
                            break;
                        case ZodIssueCode.invalid_return_type:
                            message = `${path} has an invalid return type: ${issue.message}`;
                            break;
                        case ZodIssueCode.invalid_date:
                            message = `${path} is not a valid date`;
                            break;
                        case ZodIssueCode.invalid_string:
                            message = `${path} is an invalid string: ${issue.validation}`;
                            break;
                        case ZodIssueCode.too_small:
                            message = `${path} is too small: ${issue.message}`;
                            break;
                        case ZodIssueCode.too_big:
                            message = `${path} is too big: ${issue.message}`;
                            break;
                        case ZodIssueCode.invalid_intersection_types:
                            message = `${path} has invalid intersection types`;
                            break;
                        case ZodIssueCode.not_multiple_of:
                            message = `${path} is not a multiple of ${issue.multipleOf}`;
                            break;
                        case ZodIssueCode.not_finite:
                            message = `${path} is not a finite number`;
                            break;
                        case ZodIssueCode.custom:
                            message = `${path} is invalid: ${issue.message}`;
                            break;
                        default:
                            message = `${path} is ${(issue as any).message.toLowerCase()}`;
                            break;
                    }

                    return {
                        path,
                        type: issue.code,
                        message,
                    };
                });

                res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid data', details: errorMessages });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
            }
        }
    };
}
