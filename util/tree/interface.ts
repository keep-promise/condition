import { ComponentType } from 'react';

export enum NodeType {
  Item = 'item',
  Group = 'group',
  FirstPlacement = 'first-placement',
}

export interface NodeFirstPlacement {
  id: string;
  type: NodeType.FirstPlacement;
}

export interface NodeItem<T> {
  id: string;
  type: NodeType.Item;
  data?: T;
}

export interface NodeGroup<T> {
  id: string;
  type: NodeType.Group;
  relation: string;
  children: Array<NodeGroup<T> | NodeItem<T>>;
}

export type Node<T> = NodeGroup<T> | NodeItem<T>;

export type Relation = { label: string; value: string };

export interface ExpressionProps<T> {
  value?: T;
  allValue?: any;
  onChange: (value?: T) => void;
}

export interface ConditionProps<T, K extends ExpressionProps<T> = ExpressionProps<T>> {
  relations?: Relation[];
  onChange?: (value: NodeGroup<T>) => void;
  value?: NodeGroup<T>;
  defaultValue?: NodeGroup<T>;
  Expression?: ComponentType<K>;
  AddItemButton?: ComponentType;
  AddGroupButton?: ComponentType;
}
