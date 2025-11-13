import { IsNotEmpty, IsString, IsEmail, MaxLength, MinLength, IsStrongPassword } from "class-validator";

export type ILoginDto = {
    email: string;
    password: string;
};

export class LoginDto implements ILoginDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @MaxLength(255)
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;
}

export type IRegisterDto = {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
};

export class RegisterDto implements IRegisterDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(64)
    firstname: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(64)
    lastname: string;

    @IsNotEmpty()
    @IsEmail()
    @MaxLength(255)
    email: string;

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword({ minNumbers: 1, minUppercase: 1, minLength: 8, minSymbols: 1 })
    password: string;
}
