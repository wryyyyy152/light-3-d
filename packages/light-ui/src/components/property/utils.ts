import type { GroupNode, IConverter, IDocument, VisualNode, XYZLike } from "light-core";
import { Logger, Matrix4, Property, Result, Texture } from "light-core";
import { type controlType } from "../utils";
import CheckProperty from './CheckProperty.vue';
import ColorProperty from './ColorProperty.vue';
import InputProperty from './InputProperty.vue';
import MaterialProperty from './MaterialProperty.vue';
import TextureProperty from "./material/TextureEditor.vue";

export function findPropertyControl(
    document: IDocument,
    objs: any[],
    prop: Property,
    converter?: IConverter,
): controlType | undefined {
    if (prop === undefined || objs.length === 0) return undefined;

    if (prop.type === "color") {
        return {
            component: ColorProperty,
            props: {
                document,
                objects: objs,
                property: prop
            }
        };
    }

    if (prop.type === "materialId" && canShowMaterialProperty(objs, prop)) {
        return {
            component: MaterialProperty,
            props: {
                document,
                objects: objs,
                property: prop
            }
        };
    }

    const value = objs[0][prop.name];
    if (value instanceof Texture) {
        return {
            component: TextureProperty,
            props: {
                document,
                display: prop.display,
                texture: value
            }
        };
    }

    if (["object", "string", "number"].includes(typeof value)) {
        return {
            component: InputProperty,
            props: {
                document,
                objects: objs,
                property: prop,
                converter
            }
        };
    }

    if (typeof value === "boolean") {
        return {
            component: CheckProperty,
            props: {
                objects: objs,
                property: prop,
            }
        };
    }

    Logger.warn(`Property ${prop.name} not found in ${Object.getPrototypeOf(objs[0]).constructor.name}`);
    return undefined;
}

function canShowMaterialProperty(objs: any[], prop: Property) {
    if (objs.length === 0) return false;
    if (objs.length === 1) return true;
    return objs.every((obj) => obj[prop.name] === objs[0][prop.name]);
}

export class ArrayValueConverter implements IConverter {
    constructor(
        readonly objects: any[],
        readonly property: Property,
        readonly converter?: IConverter,
    ) { }

    convert(value: any): Result<string> {
        return Result.ok(this.getDefaultValue());
    }

    convertBack?(value: string): Result<any> {
        throw new Error("Method not implemented.");
    }

    private getValueString(obj: any): string {
        const value = obj[this.property.name];
        const cvalue = this.converter?.convert(value);
        return cvalue?.isOk ? cvalue.value : String(value);
    }

    private getDefaultValue() {
        const values = this.objects.map(this.getValueString.bind(this));
        const uniqueValues = new Set(values);
        return uniqueValues.size === 1 ? values[0] : "";
    }
}

export abstract class MatrixConverter implements IConverter<Matrix4, string> {
    constructor(readonly geometry: VisualNode | GroupNode) { }

    convert(value: Matrix4): Result<string, string> {
        const [x, y, z] = this.convertFrom(value);
        return Result.ok(`${x.toFixed(6)}, ${y.toFixed(6)}, ${z.toFixed(6)}`);
    }

    protected abstract convertFrom(value: Matrix4): [number, number, number];
    protected abstract convertTo(values: XYZLike): Matrix4;

    convertBack(value: string): Result<Matrix4, string> {
        const values = value
            .split(",")
            .map(Number)
            .filter((x) => !isNaN(x));
        if (values.length !== 3) return Result.err("invalid number of values");
        const newValue = {
            x: values[0],
            y: values[1],
            z: values[2],
        };
        const matrix = this.convertTo(newValue);
        return Result.ok(matrix);
    }
}

export class TranslationConverter extends MatrixConverter {
    protected convertFrom(matrix: Matrix4): [number, number, number] {
        let position = matrix.translationPart();
        return [position.x, position.y, position.z];
    }
    protected convertTo(values: XYZLike): Matrix4 {
        const rotation = this.geometry.transform.getEulerAngles();
        const scale = this.geometry.transform.getScale();
        return Matrix4.createFromTRS(values, rotation, scale);
    }
}

export class ScalingConverter extends MatrixConverter {
    protected convertFrom(matrix: Matrix4): [number, number, number] {
        let s = matrix.getScale();
        return [s.x, s.y, s.z];
    }
    protected convertTo(values: XYZLike): Matrix4 {
        const rotation = this.geometry.transform.getEulerAngles();
        const translation = this.geometry.transform.translationPart();
        return Matrix4.createFromTRS(translation, rotation, values);
    }
}

export class RotateConverter extends MatrixConverter {
    protected convertFrom(matrix: Matrix4): [number, number, number] {
        let s = matrix.getEulerAngles();
        return [(s.pitch * 180) / Math.PI, (s.yaw * 180) / Math.PI, (s.roll * 180) / Math.PI];
    }
    protected convertTo(values: XYZLike): Matrix4 {
        const scale = this.geometry.transform.getScale();
        const translation = this.geometry.transform.translationPart();
        return Matrix4.createFromTRS(
            translation,
            {
                pitch: (values.x * Math.PI) / 180,
                yaw: (values.y * Math.PI) / 180,
                roll: (values.z * Math.PI) / 180,
            },
            scale,
        );
    }
}