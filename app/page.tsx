import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center p-2 pb-20 gap-5 font-[family-name:var(--font-geist-sans)]">
      <ConnectButton /> 
    </div>
  );
}
