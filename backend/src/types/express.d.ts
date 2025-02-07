import { JwtDecoded } from "../models/jwt";
import { User } from "../models/user";

declare global {
    namespace Express {
        interface Request {
            user?: JwtDecoded;
        }
    }
}