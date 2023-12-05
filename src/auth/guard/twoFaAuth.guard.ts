import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
 
export default class JwtTwoFaGuard extends AuthGuard('jwt-two-factor') {}