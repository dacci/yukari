import IpCalc from './IpCalc';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IP Calc',
};

export default function Page() {
  return (
    <main>
      <IpCalc/>
    </main>
  );
}
