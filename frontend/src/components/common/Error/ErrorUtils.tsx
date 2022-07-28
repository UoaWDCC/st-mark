export interface ErrorMessage {
  title: string;
  message: string;
}
export interface URLDirection {
  url: string;
  prompt: string;
}

export const ServerError: ErrorMessage = {
  title: "Server Error",
  message: "Please try refreshing your browser",
};

export const ProfileError: ErrorMessage = {
  title: "Profile Not Found",
  message: "This profile does not exist",
};
