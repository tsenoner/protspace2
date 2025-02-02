export interface CartoonStyle {
  hidden: boolean;
  color: string;
  style: string;
  ribbon: boolean;
  arrows: boolean;
  tubes: boolean;
  thickness: number;
  width: number;
  opacity: number;
}

export interface LineStyle {
  hidden: boolean;
  color: string;
  wireframe: boolean;
  opacity: number;
}

export interface StickStyle {
  hidden: boolean;
  color: string;
  opacity: number;
  radius: number;
  showNonBonded: boolean;
  singleBonds: boolean;
}

export type AtomStyleSpec = {
  cartoon?: CartoonStyle;
  line?: LineStyle;
  stick?: StickStyle;
};

export interface Item {
  category: string;
  name: string;
  color?: string;
  img?: string;
  id?: string;
}

export const defaultDatasets = ["3FTx", "KLK"];
