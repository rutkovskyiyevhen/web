// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, VerifyCallback } from 'passport-google-oauth20';
// import { config } from 'src/common/configs/env.config';

// @Injectable()
// export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
//   constructor() {
//     super({
//       clientID: config.google_client_id,
//       clientSecret: config.google_client_secret,
//       callbackURL: config.google_callback_url,
//       scope: ['email', 'profile'],
//     });
//   }

//   async validate(
//     accessToken: string,
//     refreshToken: string,
//     profile: any,
//     done: VerifyCallback,
//   ) {
//     const email = profile?.emails?.[0]?.value;
//     const emailVerified =
//       profile?.emails?.[0]?.verified ?? true;
//     const googleId = profile?.id;
//     const displayName = profile?.displayName;

//     done(null, {
//       googleId,
//       email,
//       emailVerified,
//       displayName,
//     });
//   }
// }
