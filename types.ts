
export interface OPMData {
  grandeComando: string;
  opm: string;
  existente: {
    capQoem: number;
    capQoe: number;
    ten1Qoem: number;
    ten1Qoe: number;
    ten2Qoem: number;
    ten2Qoe: number;
    total: number;
    st: number;
    concorremEscala: number;
  };
  deficit: {
    capQoem: number;
    capQoe: number;
    ten1Qoem: number;
    ten1Qoe: number;
    ten2Qoem: number;
    ten2Qoe: number;
    total: number;
  };
}