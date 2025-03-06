import { IconType } from "react-icons";
import * as Icons from "react-icons/fa";

export type IconName = keyof typeof Icons;

export function getIconComponent(iconName: IconName): IconType {
  return Icons[iconName];
} 