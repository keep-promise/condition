import { NodeGroup, Node, NodeType, NodeItem } from './interface';

// 生成随机字符串
export function random(): string {
  return Math.random().toString(36).slice(2) || random();
}

// 创建一个默认组
export function createNodeGroup<T>(relation: string): NodeGroup<T> {
  return { type: NodeType.Group, id: random(), relation, children: [] };
}

// 创建一个默认项
export function createNodeItem<T>(): NodeItem<T> {
  return { type: NodeType.Item, id: random() };
}

// 递归查询节点
export function findNode<T>(
  source: Node<T>,
  targetId: string,
  parent?: NodeGroup<T>,
): false | { item: Node<T>; parent: NodeGroup<T> | undefined } {
  if (source.id === targetId) return { item: source, parent };
  if (source.type !== NodeType.Group) return false;

  for (let i = 0; i < source.children.length; i++) {
    const result = findNode(source.children[i], targetId, source);
    if (result) return result;
  }
  return false;
}

// 判断是否是子节点
export function isChildrenNode<T>(source: Node<T>, sourceId: string, targetId: string): boolean {
  const area = findNode(source, sourceId);

  if (!area || area.item.type !== NodeType.Group) return false;
  return sourceId !== targetId && !!findNode(area.item, targetId);
}

// 判断是否是根节点
export function isRootNode<T>(source: Node<T>, targetId: string): boolean {
  const target = findNode(source, targetId);
  return !!target && !target.parent;
}

// 快速 Clone 结构化数据
function cloneNode<T>(source: NodeGroup<T>): NodeGroup<T> {
  return JSON.parse(JSON.stringify(source));
}

// 删除直接子节点
function removeChildNode<T>(parent: NodeGroup<T>, child: Node<T>) {
  if (parent.type !== NodeType.Group) return;

  const index = parent.children.findIndex((v) => v.id === child.id);
  if (index !== -1) parent.children.splice(index, 1);
}

// 在一棵树下的某个节点中增加直接子节点
export function addNode<T>(source: NodeGroup<T>, targetId: string, type: NodeType, relation: string) {
  const result = cloneNode(source);
  const target = findNode(result, targetId);
  if (target && target.item.type === NodeType.Group) {
    target.item.children.push(type === NodeType.Group ? createNodeGroup(relation) : createNodeItem());
  }
  return result;
}

// 删除一棵树中的某个节点
export function removeNode<T>(source: NodeGroup<T>, targetId: string) {
  const result = cloneNode(source);
  const target = findNode(result, targetId);
  if (target && target.parent) {
    removeChildNode(target.parent, target.item);
  }
  return result;
}

// 移动一个节点作为目标节点的兄弟，如果 asChild 为 true 则表达不是作为兄弟，而是作为子节点
export function moveNode<T>(source: NodeGroup<T>, fromId: string, targetId: string, asChild: boolean) {
  const result = cloneNode(source);
  const from = findNode(result, fromId);
  const target = findNode(result, targetId);

  if (from && target && from.parent) {
    // 把原来的节点从树中删除
    removeChildNode(from.parent, from.item);

    if (!asChild && target.parent) {
      // 如果不作为子节点，并且存在父节点
      const index = target.parent.children.findIndex((v) => v.id === target.item.id);
      target.parent.children.splice(index + 1, 0, from.item);
    } else if (asChild && target.item.type === NodeType.Group) {
      // 如果作为子节点，同时目标节点是节点组
      target.item.children.splice(0, 0, from.item);
    }
  }
  return result;
}

// 编辑一个节点的值
export function editNodeGroup<T, K extends keyof NodeGroup<T>>(
  source: NodeGroup<T>,
  targetId: string,
  key: K,
  value: NodeGroup<T>[K],
) {
  const result = cloneNode(source);
  const target = findNode(result, targetId);
  if (target && target.item.type === NodeType.Group) {
    target.item[key] = value;
  }
  return result;
}
export function editNodeItem<T, K extends keyof NodeItem<T>>(
  source: NodeGroup<T>,
  targetId: string,
  key: K,
  value: NodeItem<T>[K],
) {
  const result = cloneNode(source);
  const target = findNode(result, targetId);
  if (target && target.item.type === NodeType.Item) {
    target.item[key] = value;
  }
  return result;
}
