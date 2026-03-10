/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useRef, useState, useCallback } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonText,
  IonButtons,
  IonBackButton,
  IonIcon,
} from '@ionic/react';
import { addCircleOutline, searchOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useStockSearch } from '../hooks/useStocks';
import { usePortfolio } from '../hooks/usePortfolio';

const centerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40vh;
  flex-direction: column;
  gap: 8px;
`;

const hintStyle = css`
  text-align: center;
  margin-top: 60px;
  padding: 0 32px;
`;

const searchContainer = css`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  gap: 8px;
  border-bottom: 1px solid var(--ion-color-light, #e0e0e0);
`;

const searchInput = css`
  flex: 1;
  padding: 10px 12px;
  font-size: 1rem;
  border: 1px solid var(--ion-color-medium, #999);
  border-radius: 8px;
  background: var(--ion-background-color, #fff);
  color: var(--ion-text-color, #000);
  outline: none;
  &:focus {
    border-color: var(--ion-color-primary);
  }
  &::placeholder {
    color: #999;
  }
`;

export default function AddStock() {
  const [searchText, setSearchText] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const history = useHistory();

  const { data: results, isLoading, error } = useStockSearch(searchText);
  const { addStock, isAdding } = usePortfolio();

  const handleSearchInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearchText(val), 300);
  }, []);

  const handleAdd = async (symbol: string) => {
    try {
      await addStock({ symbol });
      history.goBack();
    } catch {
      // stay on page if add fails
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/dashboard" />
          </IonButtons>
          <IonTitle>Add Stock</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div css={searchContainer}>
          <IonIcon icon={searchOutline} style={{ fontSize: '1.2rem', color: '#999' }} />
          <input
            css={searchInput}
            type="text"
            placeholder="Search by symbol or name..."
            onChange={handleSearchInput}
            autoFocus
          />
        </div>

        {!searchText && (
          <div css={hintStyle}>
            <IonText color="medium">
              <p>Search for a stock by typing its symbol or company name</p>
            </IonText>
          </div>
        )}

        {isLoading && (
          <div css={centerStyle}>
            <IonSpinner name="dots" />
          </div>
        )}

        {error && (
          <div css={centerStyle}>
            <IonText color="danger">Search failed. Try again.</IonText>
          </div>
        )}

        {results && results.length === 0 && searchText && (
          <div css={centerStyle}>
            <IonText color="medium">No results found for "{searchText}"</IonText>
          </div>
        )}

        {results && results.length > 0 && (
          <IonList>
            {results.map((result) => (
              <IonItem
                key={result.symbol}
                button
                onClick={() => !isAdding && handleAdd(result.symbol)}
                style={isAdding ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
              >
                <IonLabel>
                  <h2>{result.symbol}</h2>
                  <p>{result.name}</p>
                  <p style={{ fontSize: '0.75rem', color: '#aaa' }}>{result.sector}</p>
                </IonLabel>
                <IonIcon icon={addCircleOutline} slot="end" color="primary" />
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
}
