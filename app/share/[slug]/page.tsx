import { Metadata } from 'next';
import { redirect } from 'next/navigation';

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// This generates the preview card for Telegram
export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  // Slug format: amount-uniqueId
  const [amount] = params.slug.split('-');

  return {
    title: `Вам отправили чек на ${amount} звёзд! ⭐`,
    description: 'Нажмите, чтобы активировать подарок и забрать звезды.',
    openGraph: {
      title: `Лови чек на ${amount} звёзд!`,
      description: 'Самый быстрый способ передать звезды.',
      images: ['https://cdn-icons-png.flaticon.com/512/8672/8672669.png'], // ЗАМЕНИТЕ НА ВАШУ КАРТИНКУ ЧЕКА
    },
  };
}

export default function SharePage({ params }: Props) {
  const [amount, uniqueId] = params.slug.split('-');
  
  // Construct the Bot URL
  // Format: start=gift_UNIQUEID_AMOUNT
  const botUrl = `https://t.me/LoviZbot?start=gift_${uniqueId}_${amount}`;

  // Server-side redirect (fastest)
  redirect(botUrl);
}

