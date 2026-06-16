import './CardDeck.css';

export interface CardDeckProps {
  className?: string;
}

export default function CardDeck({ className = '' }: CardDeckProps) {
  return <div className={`card-deck-root ${className}`}>Card Deck component</div>;
}
