import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, IsSemVer, IsString, MaxLength } from "class-validator";
import { CompanyType, ICompanyContract } from "../models/Company";
import { Type } from "class-transformer";

export class CompanyDto implements ICompanyContract {
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    name: string;

    @IsNotEmpty()
    @IsEnum(CompanyType)
    type: CompanyType;

    @IsNotEmpty()
    @IsString()
    @MaxLength(10)
    nip: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(14)
    regon: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    bdo?: string;

    @IsOptional()
    @IsString()
    @MaxLength(10)
    krs?: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    street: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(10)
    address: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(6)
    zipcode: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    city: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    country: string;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    registerDate: Date;

    @IsNotEmpty()
    @IsBoolean()
    vat: boolean;
}
