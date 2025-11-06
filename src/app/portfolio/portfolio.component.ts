import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioService, PortfolioResponseDto, CreatePortfolioDto, PortfolioAnalyticsDto, TransferDto } from '../services/portfolio.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  portfolios: PortfolioResponseDto[] = [];
  selectedPortfolio: PortfolioResponseDto | null = null;
  analytics: PortfolioAnalyticsDto | null = null;
  showCreateForm = false;
  showDepositForm = false;
  showWithdrawForm = false;
  showTransferForm = false;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  // Formulaire de création
  newPortfolio: CreatePortfolioDto = {
    solde: 0,
    risque: 0,
    typePortefeuille: 'individual',
    nomPortefeuille: '',
    description: ''
  };

  // Formulaire de dépôt/retrait
  amount: number = 0;

  // Formulaire de transfert
  transferData: TransferDto = {
    idPortefeuilleSource: 0,
    idPortefeuilleDestination: 0,
    montant: 0,
    description: ''
  };

  constructor(
    private portfolioService: PortfolioService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Vérifier si l'utilisateur est connecté
    if (!this.authService.isLoggedIn()) {
      this.error = 'Vous devez être connecté pour accéder à vos portfolios. Veuillez vous connecter.';
      return;
    }
    this.loadPortfolios();
  }

  loadPortfolios() {
    this.loading = true;
    this.error = null;
    this.portfolioService.getUserPortfolios().subscribe({
      next: (portfolios) => {
        this.portfolios = portfolios;
        this.loading = false;
        // Si l'utilisateur n'a pas de portfolio, on peut suggérer d'en créer un
        if (portfolios.length === 0) {
          this.showCreateForm = true;
        }
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 401 || err.status === 403) {
          this.error = 'Vous devez être connecté pour accéder à vos portfolios. Veuillez vous connecter.';
        } else if (err.status === 500) {
          this.error = 'Erreur serveur. Veuillez vérifier que vous êtes connecté et réessayer.';
        } else {
          this.error = 'Erreur lors du chargement des portfolios: ' + (err.message || 'Erreur inconnue');
        }
        console.error('Erreur portfolios:', err);
      }
    });
  }

  createPortfolio() {
    if (!this.newPortfolio.nomPortefeuille || this.newPortfolio.solde <= 0) {
      this.error = 'Veuillez remplir tous les champs requis';
      return;
    }

    this.loading = true;
    this.error = null;
    this.portfolioService.createPortfolio(this.newPortfolio).subscribe({
      next: (portfolio) => {
        this.success = 'Portfolio créé avec succès !';
        this.showCreateForm = false;
        this.resetCreateForm();
        this.loadPortfolios();
        setTimeout(() => this.success = null, 3000);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 401 || err.status === 403) {
          this.error = 'Vous devez être connecté pour créer un portfolio. Veuillez vous connecter.';
        } else if (err.status === 500) {
          this.error = 'Erreur serveur lors de la création. Vérifiez vos informations et réessayez.';
        } else {
          this.error = 'Erreur lors de la création du portfolio: ' + (err.message || 'Erreur inconnue');
        }
        console.error('Erreur création portfolio:', err);
      }
    });
  }

  selectPortfolio(portfolio: PortfolioResponseDto) {
    this.selectedPortfolio = portfolio;
    this.loadAnalytics(portfolio.id);
  }

  loadAnalytics(portfolioId: number) {
    this.loading = true;
    this.portfolioService.getPortfolioAnalytics(portfolioId).subscribe({
      next: (analytics) => {
        this.analytics = analytics;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des analytics';
        this.loading = false;
        console.error(err);
      }
    });
  }

  depositFunds() {
    if (!this.selectedPortfolio || this.amount <= 0) {
      this.error = 'Veuillez sélectionner un portfolio et entrer un montant valide';
      return;
    }

    this.loading = true;
    this.error = null;
    this.portfolioService.depositFunds(this.selectedPortfolio.id, this.amount).subscribe({
      next: () => {
        this.success = 'Fonds déposés avec succès !';
        this.showDepositForm = false;
        this.amount = 0;
        this.loadPortfolios();
        if (this.selectedPortfolio) {
          this.selectPortfolio(this.selectedPortfolio);
        }
        setTimeout(() => this.success = null, 3000);
      },
      error: (err) => {
        this.error = 'Erreur lors du dépôt';
        this.loading = false;
        console.error(err);
      }
    });
  }

  withdrawFunds() {
    if (!this.selectedPortfolio || this.amount <= 0) {
      this.error = 'Veuillez sélectionner un portfolio et entrer un montant valide';
      return;
    }

    this.loading = true;
    this.error = null;
    this.portfolioService.withdrawFunds(this.selectedPortfolio.id, this.amount).subscribe({
      next: () => {
        this.success = 'Fonds retirés avec succès !';
        this.showWithdrawForm = false;
        this.amount = 0;
        this.loadPortfolios();
        if (this.selectedPortfolio) {
          this.selectPortfolio(this.selectedPortfolio);
        }
        setTimeout(() => this.success = null, 3000);
      },
      error: (err) => {
        this.error = 'Erreur lors du retrait';
        this.loading = false;
        console.error(err);
      }
    });
  }

  transferFunds() {
    if (!this.transferData.idPortefeuilleSource || !this.transferData.idPortefeuilleDestination || this.transferData.montant <= 0) {
      this.error = 'Veuillez remplir tous les champs du transfert';
      return;
    }

    this.loading = true;
    this.error = null;
    this.portfolioService.transferFunds(this.transferData).subscribe({
      next: () => {
        this.success = 'Transfert effectué avec succès !';
        this.showTransferForm = false;
        this.resetTransferForm();
        this.loadPortfolios();
        if (this.selectedPortfolio) {
          this.selectPortfolio(this.selectedPortfolio);
        }
        setTimeout(() => this.success = null, 3000);
      },
      error: (err) => {
        this.error = 'Erreur lors du transfert';
        this.loading = false;
        console.error(err);
      }
    });
  }

  generateReport() {
    if (!this.selectedPortfolio) return;

    this.loading = true;
    this.portfolioService.generatePortfolioReport(this.selectedPortfolio.id).subscribe({
      next: (report) => {
        this.analytics = report;
        this.success = 'Rapport généré avec succès !';
        this.loading = false;
        setTimeout(() => this.success = null, 3000);
      },
      error: (err) => {
        this.error = 'Erreur lors de la génération du rapport';
        this.loading = false;
        console.error(err);
      }
    });
  }

  resetCreateForm() {
    this.newPortfolio = {
      solde: 0,
      risque: 0,
      typePortefeuille: 'individual',
      nomPortefeuille: '',
      description: ''
    };
  }

  resetTransferForm() {
    this.transferData = {
      idPortefeuilleSource: 0,
      idPortefeuilleDestination: 0,
      montant: 0,
      description: ''
    };
  }

  formatCurrency(amount: number | undefined): string {
    if (amount === undefined || amount === null) return '0,00 €';
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  }

  formatPercentage(value: number | undefined): string {
    if (value === undefined || value === null) return '0,00 %';
    return `${value.toFixed(2)} %`;
  }

  getRiskLevel(risque: number | undefined): string {
    if (risque === undefined || risque === null) return 'Non défini';
    if (risque < 30) return 'Faible';
    if (risque < 70) return 'Moyen';
    return 'Élevé';
  }

  getRiskColor(risque: number | undefined): string {
    if (risque === undefined || risque === null) return '#gray';
    if (risque < 30) return '#4caf50';
    if (risque < 70) return '#ff9800';
    return '#f44336';
  }
}
