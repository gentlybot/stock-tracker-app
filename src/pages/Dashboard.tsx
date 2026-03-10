/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonSpinner,
  IonText,
  IonFab,
  IonFabButton,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/react';
import { addOutline, logOutOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { usePortfolio } from '../hooks/usePortfolio';
import { useAuth } from '../hooks/useAuth';
import { StockCard } from '../components/StockCard';
import { PortfolioSummary } from '../components/PortfolioSummary';
import { useQueryClient } from '@tanstack/react-query';

const centerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  flex-direction: column;
  gap: 12px;
`;

const emptyStyle = css`
  text-align: center;
  margin-top: 80px;
  padding: 0 32px;
`;

export default function Dashboard() {
  const { portfolio, isLoading, error } = usePortfolio();
  const { logout } = useAuth();
  const history = useHistory();
  const queryClient = useQueryClient();

  const handleStockClick = (symbol: string) => {
    history.push(`/stock/${symbol}`);
  };

  const handleLogout = () => {
    logout();
    history.replace('/login');
  };

  const handleRefresh = async (event: CustomEvent) => {
    await queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    (event.target as HTMLIonRefresherElement).complete();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dashboard</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>
              <IonIcon icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {isLoading && (
          <div css={centerStyle}>
            <IonSpinner name="crescent" />
            <IonText color="medium">Loading portfolio...</IonText>
          </div>
        )}

        {error && (
          <div css={centerStyle}>
            <IonText color="danger">{error}</IonText>
            <IonButton fill="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ['portfolio'] })}>
              Retry
            </IonButton>
          </div>
        )}

        {portfolio && portfolio.stocks.length === 0 && (
          <div css={emptyStyle}>
            <IonText color="medium">
              <h2>No stocks yet</h2>
              <p>Tap the + button to add stocks to your portfolio</p>
            </IonText>
          </div>
        )}

        {portfolio && portfolio.stocks.length > 0 && (
          <>
            <PortfolioSummary portfolio={portfolio} />
            {portfolio.stocks.map((stock) => (
              <StockCard
                key={stock.symbol}
                stock={stock}
                onClick={handleStockClick}
              />
            ))}
          </>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/add-stock')}>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
}
