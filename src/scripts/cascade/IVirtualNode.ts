import Cascade from './Cascade';

export interface IVirtualNodeProperties {
    ref?: (node: Node) => void;
}

export interface IVirtualNode<T extends IVirtualNodeProperties> {
    properties: T;
    children: Array<IVirtualNode<any> | string | number>;

    toNode(oldValue?: Node): Node;
    toString(): string;
}

export enum PatchOperation {
    ADD = 0,
    REMOVE,
    MOVE
}

export interface IVirtualNodePatch {
    newNode?: IVirtualNode<any> | string | number;
    oldNode?: IVirtualNode<any> | string | number;
    operation: PatchOperation;
}
