import DnsResolver from './DnsResolver';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DNS Resolver',
};

export default function Page() {
  return (
    <main>
      <DnsResolver/>
    </main>
  );
}
