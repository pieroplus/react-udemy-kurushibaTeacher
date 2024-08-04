import axios from "axios";
import { SpotifyPoplularSongs, SpotifySearchedSongs } from "../type";

class SpotifyClient {
  token: string | undefined;

  static async initialize(): Promise<SpotifyClient> {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", process.env.REACT_APP_SPOTIFY_CLIENT_ID || "");
    params.append(
      "client_secret",
      process.env.REACT_APP_SPOTIFY_CLIENT_SECRET || ""
    );
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const spotify = new SpotifyClient();
    spotify.token = response.data.access_token;
    return spotify;
  }
  async getPopularSongs(): Promise<SpotifyPoplularSongs> {
    if (!this.token) {
      throw new Error("Token is not Available");
    }
    const response = await axios.get(
      "https://api.spotify.com/v1/playlists/37i9dQZF1DX9vYRBO9gjDe/tracks",
      {
        headers: { Authorization: `Bearer ${this.token}` },
      }
    );
    return response.data;
  }

  async searchSongs(
    keyword: string,
    offset: number,
    limit: number = 20
  ): Promise<SpotifySearchedSongs> {
    const params = new URLSearchParams();
    params.append("q", keyword);
    params.append("type", "track");
    params.append("limit", String(limit));
    params.append("offset", String(offset));
    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: { Authorization: `Bearer ${this.token}` },
      params,
    });
    console.log(response);
    return response.data;
  }
}

const spotifyPromise = SpotifyClient.initialize();

export default spotifyPromise;
