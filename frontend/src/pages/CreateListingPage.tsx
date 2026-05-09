import BackButton from '../components/ui/BackButton';

export default function CreateListingPage() {
  return (
    <main className="min-h-screen bg-[#0e0e0f] text-white px-8 py-16">
      <div className="max-w-360 mx-auto">
        <BackButton />
        <h1 className="font-headline text-4xl font-black uppercase tracking-tight">
          Publicar anuncio
        </h1>
      </div>
    </main>
  );
}
