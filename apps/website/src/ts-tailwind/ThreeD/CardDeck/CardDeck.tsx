export interface CardDeckProps {
  className?: string;
}

export default function CardDeck({ className = '' }: CardDeckProps) {
  return (
    <div className={`flex items-center justify-center p-4 text-white ${className}`}>Card Deck component</div>
  );
}
