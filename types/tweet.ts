// Type definitions for tweets and X API responses

export interface Tweet {
  id: string;
  text: string;
  created_at: string;
  author_id: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
}

export interface TwitterUser {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
}

export interface TwitterAPIResponse {
  data: Tweet[];
  includes?: {
    users?: TwitterUser[];
  };
  meta?: {
    result_count: number;
    newest_id?: string;
    oldest_id?: string;
  };
}

export interface CreateTweetRequest {
  text: string;
}

export interface CreateTweetResponse {
  data: {
    id: string;
    text: string;
  };
}

export interface DeleteTweetResponse {
  data: {
    deleted: boolean;
  };
}
