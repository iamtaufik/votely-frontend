interface Name {
  familyName: string;
  givenName: string;
}

interface Email {
  value: string;
  verified: boolean;
}

interface Photo {
  value: string;
}

export interface User {
  id: string;
  displayName: string;
  name: Name;
  emails: Email[];
  photos: Photo[];
  provider: string;
}
