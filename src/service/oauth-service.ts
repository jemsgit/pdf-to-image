import { OAuth2Client } from "google-auth-library";
import axios from 'axios';


const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // if (1) {
  //   next();
  //   return;
  // }
  console.log(req.headers)
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { data } = await axios.get(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`
    );

    console.log(data)

    // if (data.aud !== CLIENT_ID) {
    //   return res.status(403).json({ error: "Invalid client ID" });
    // }

    req.user = {
      id: data.sub,
      email: data.email,
      name: data.name,
      picture: data.picture,
    };
    console.log(req.user)

    next(); // Allow request to proceed
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(403).json({ error: "Invalid token" });
  }
}
