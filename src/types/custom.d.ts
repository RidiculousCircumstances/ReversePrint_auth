declare namespace Express {
  export interface IFingerprintObject {
    ip: string;
    fingerprint: string;
  }

  export interface Request {
    user: {
      userId: string;
      email: string;
      isActivated: boolean;
    };
    fingerprintObject: IFingerprintObject;
  }
}
