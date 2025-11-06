import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreatePortfolioDto {
  solde: number;
  risque?: number;
  typePortefeuille: 'individual' | 'shared';
  nomPortefeuille?: string;
  description?: string;
  rendementCible?: number;
  drawdownMaximal?: number;
  idsUtilisateursInvites?: number[];
  autoriserTradingMembres?: boolean;
}

export interface PortfolioResponseDto {
  id: number;
  solde: number;
  risque?: number;
  valeurNette?: number;
  typePortefeuille: 'individual' | 'shared';
  nomPortefeuille?: string;
  description?: string;
  rendementCible?: number;
  drawdownMaximal?: number;
  estActif?: boolean;
  dateCreation?: string;
  dateModification?: string;
  rendementTotal?: number;
  rendementAnnuel?: number;
  volatilite?: number;
  ratioSharpe?: number;
  drawdownMaximalReel?: number;
  idProprietaire?: number;
  nomProprietaire?: string;
  membres?: PortfolioMemberDto[];
  totalTransactions?: number;
  tailleMoyenneTransaction?: number;
  niveauRisque?: string;
}

export interface PortfolioMemberDto {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface PortfolioAnalyticsDto {
  idPortefeuille: number;
  nomPortefeuille?: string;
  rendementTotal?: number;
  rendementAnnuel?: number;
  volatilite?: number;
  ratioSharpe?: number;
  drawdownMaximal?: number;
  drawdownActuel?: number;
  niveauRisque?: string;
  beta?: number;
  alpha?: number;
  valeurARisque?: number;
  perteAttendue?: number;
  allocationActifs?: { [key: string]: number };
  allocationSecteurs?: { [key: string]: number };
  nombreActifs?: number;
  risqueConcentration?: number;
  historiqueValeurs?: any[];
  historiqueRendements?: any[];
  rendementReference?: number;
  erreurSuivi?: number;
  ratioInformation?: number;
  totalTransactions?: number;
  tailleMoyenneTransaction?: number;
  tauxReussite?: number;
  gainMoyen?: number;
  perteMoyenne?: number;
  derniereMiseAJour?: string;
  dateAnalyse?: string;
}

export interface TransferDto {
  idPortefeuilleSource: number;
  idPortefeuilleDestination: number;
  montant: number;
  description?: string;
  typeTransfert?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private baseUrl = 'http://localhost:8081/api/api/portfolios';

  constructor(private http: HttpClient) {}

  // Créer un portfolio (lié à l'utilisateur courant)
  createPortfolio(createPortfolioDto: CreatePortfolioDto): Observable<PortfolioResponseDto> {
    return this.http.post<PortfolioResponseDto>(`${this.baseUrl}`, createPortfolioDto);
  }

  // Obtenir tous les portfolios de l'utilisateur
  getUserPortfolios(): Observable<PortfolioResponseDto[]> {
    return this.http.get<PortfolioResponseDto[]>(`${this.baseUrl}`);
  }

  // Obtenir un portfolio par ID (lié à l'utilisateur courant)
  getPortfolioById(id: number): Observable<PortfolioResponseDto> {
    return this.http.get<PortfolioResponseDto>(`${this.baseUrl}/${id}`);
  }

  // Obtenir le solde d'un portfolio
  getPortfolioBalance(id: number): Observable<PortfolioResponseDto> {
    return this.http.get<PortfolioResponseDto>(`${this.baseUrl}/${id}/balance`);
  }

  // Déposer des fonds (paramètre amount)
  depositFunds(id: number, montant: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/add-funds?amount=${encodeURIComponent(montant)}`, null);
  }

  // Retirer des fonds (paramètre amount)
  withdrawFunds(id: number, montant: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/withdraw-funds?amount=${encodeURIComponent(montant)}`, null);
  }

  // Obtenir les analytics d'un portfolio
  getPortfolioAnalytics(id: number): Observable<PortfolioAnalyticsDto> {
    return this.http.get<PortfolioAnalyticsDto>(`${this.baseUrl}/${id}/analytics`);
  }

  // Obtenir les membres d'un portfolio
  getPortfolioMembers(id: number): Observable<PortfolioMemberDto[]> {
    return this.http.get<PortfolioMemberDto[]>(`${this.baseUrl}/${id}/members`);
  }

  // Obtenir l'historique d'un portfolio
  getPortfolioHistory(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${id}/history`);
  }

  // Générer un rapport de portfolio
  generatePortfolioReport(id: number): Observable<PortfolioAnalyticsDto> {
    return this.http.get<PortfolioAnalyticsDto>(`${this.baseUrl}/${id}/report`);
  }

  // Transférer des fonds entre portfolios
  transferFunds(transferDto: TransferDto): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/transfer`, transferDto);
  }

  // Mettre à jour un portfolio
  updatePortfolio(id: number, portfolioDto: Partial<PortfolioResponseDto>): Observable<PortfolioResponseDto> {
    return this.http.put<PortfolioResponseDto>(`${this.baseUrl}/${id}`, portfolioDto);
  }

  // Supprimer un portfolio
  deletePortfolio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

