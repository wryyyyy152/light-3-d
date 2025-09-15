import type { IConverter, } from "light-core";
import { Result } from "light-core";

export class UrlStringConverter implements IConverter<string> {
    convert(value: string): Result<string> {
        return Result.ok(`url('${value}')`);
    }
}
