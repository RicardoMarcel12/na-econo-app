import { CuotaMembresia, ReporteMora } from '../types/models';

export interface MoraCategoryStats {
  count: number;
  percentage: number;
  totalDebt: number;
  members: string[];
}

export interface MoraDashboardCalculation {
  totalMembers: number;
  totalDebt: number;
  solventes: MoraCategoryStats;
  moraPequena: MoraCategoryStats;
  mora3Mas: MoraCategoryStats;
  calculatedAt: string;
}

/**
 * Backend calculation engine for real-time Mora categorization:
 * - SOLVENTES!: Members with $0.00 debt or active payments without arrears
 * - MORA PEQUEÑA: Members with debt < 3 months (1 or 2 months)
 * - 3 MESES O MAS: Members with 3 or more months in arrears
 */
export function calculateMoraCategories(
  cuotas: CuotaMembresia[],
  moraList: ReporteMora[]
): MoraDashboardCalculation {
  // Aggregate all unique member names across cuotas and mora
  const allMemberNames = new Set<string>();
  cuotas.forEach((c) => {
    if (c.Miembro_Aspirante && c.Miembro_Aspirante.trim()) {
      allMemberNames.add(c.Miembro_Aspirante.trim());
    }
  });
  moraList.forEach((m) => {
    if (m.Miembro_Aspirante && m.Miembro_Aspirante.trim()) {
      allMemberNames.add(m.Miembro_Aspirante.trim());
    }
  });

  // Map each member to their latest mora record
  const moraMap = new Map<string, ReporteMora>();
  moraList.forEach((m) => {
    const key = m.Miembro_Aspirante.trim().toLowerCase();
    const existing = moraMap.get(key);
    if (!existing || m.Saldo_Actual > existing.Saldo_Actual) {
      moraMap.set(key, m);
    }
  });

  const solventesList: string[] = [];
  const moraPequenaList: string[] = [];
  const mora3MasList: string[] = [];

  let deudaPequena = 0;
  let deuda3Mas = 0;

  allMemberNames.forEach((name) => {
    const key = name.toLowerCase();
    const moraRecord = moraMap.get(key);

    if (!moraRecord || moraRecord.Saldo_Actual <= 0 || moraRecord.Meses_En_Mora <= 0) {
      // Solvent member
      solventesList.push(name);
    } else if (moraRecord.Meses_En_Mora < 3) {
      // Mora pequeña (1 or 2 months)
      moraPequenaList.push(name);
      deudaPequena += moraRecord.Saldo_Actual;
    } else {
      // 3 meses o más
      mora3MasList.push(name);
      deuda3Mas += moraRecord.Saldo_Actual;
    }
  });

  const totalMembers = allMemberNames.size || 1; // prevent div by 0

  const solventesPct = Math.round((solventesList.length / totalMembers) * 100);
  const moraPequenaPct = Math.round((moraPequenaList.length / totalMembers) * 100);
  const mora3MasPct = Math.max(0, 100 - solventesPct - moraPequenaPct);

  return {
    totalMembers: allMemberNames.size,
    totalDebt: deudaPequena + deuda3Mas,
    solventes: {
      count: solventesList.length,
      percentage: solventesPct,
      totalDebt: 0,
      members: solventesList,
    },
    moraPequena: {
      count: moraPequenaList.length,
      percentage: moraPequenaPct,
      totalDebt: deudaPequena,
      members: moraPequenaList,
    },
    mora3Mas: {
      count: mora3MasList.length,
      percentage: mora3MasPct,
      totalDebt: deuda3Mas,
      members: mora3MasList,
    },
    calculatedAt: new Date().toISOString(),
  };
}
