import { google } from "googleapis";
import {googleEmailConfig} from "../variables.js";

const OAuth2 = google.auth.OAuth2;
const id = googleEmailConfig.clientId;
const secret = googleEmailConfig.clientSecret;

const OAuth2Client = new OAuth2(id, secret);
export default OAuth2Client;