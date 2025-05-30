import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <Link 
              to="/dashboard" 
              className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Torna alla Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Termini e Condizioni d'Uso
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
            </p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2>1. Accettazione dei Termini</h2>
            <p>
              Utilizzando Lista della Spesa ("il Servizio"), accetti integralmente 
              questi Termini e Condizioni d'Uso. Se non accetti questi termini, 
              non utilizzare il Servizio.
            </p>

            <h2>2. Descrizione del Servizio</h2>
            <p>
              Lista della Spesa è un'applicazione web gratuita che consente agli 
              utenti di creare, gestire e condividere liste della spesa digitali. 
              Il servizio include funzionalità di:
            </p>
            <ul>
              <li>Creazione e gestione di liste della spesa</li>
              <li>Aggiunta e categorizzazione di prodotti</li>
              <li>Condivisione di liste con altri utenti</li>
              <li>Sincronizzazione in tempo reale</li>
            </ul>

            <h2>3. Registrazione e Account</h2>
            <p>
              Per utilizzare il Servizio è necessario creare un account fornendo 
              un indirizzo email valido. Ti impegni a:
            </p>
            <ul>
              <li>Fornire informazioni accurate e aggiornate</li>
              <li>Mantenere la sicurezza delle credenziali di accesso</li>
              <li>Notificare immediatamente qualsiasi uso non autorizzato</li>
              <li>Essere responsabile di tutte le attività svolte tramite il tuo account</li>
            </ul>

            <h2>4. Uso Accettabile</h2>
            <p>Ti impegni a utilizzare il Servizio solo per scopi leciti e a non:</p>
            <ul>
              <li>Violare leggi, regolamenti o diritti di terzi</li>
              <li>Trasmettere contenuti offensivi, diffamatori o illegali</li>
              <li>Interferire con il funzionamento del Servizio</li>
              <li>Tentare di accedere a sistemi o dati non autorizzati</li>
              <li>Utilizzare il Servizio per scopi commerciali senza autorizzazione</li>
              <li>Creare account multipli o falsi</li>
            </ul>

            <h2>5. Contenuti dell'Utente</h2>
            <p>
              Mantieni la proprietà dei contenuti che inserisci nel Servizio 
              (liste, prodotti, note). Concedi tuttavia una licenza limitata 
              per elaborare e memorizzare tali contenuti al fine di fornire il Servizio.
            </p>
            <p>
              Sei responsabile dei contenuti che inserisci e garantisci che non 
              violino diritti di terzi o normative vigenti.
            </p>

            <h2>6. Proprietà Intellettuale</h2>
            <p>
              Il Servizio, inclusi design, codice, marchi e contenuti, è protetto 
              da diritti di proprietà intellettuale. Non è consentito:
            </p>
            <ul>
              <li>Copiare, modificare o distribuire il software</li>
              <li>Effettuare reverse engineering</li>
              <li>Rimuovere avvisi di copyright o proprietà</li>
              <li>Utilizzare marchi senza autorizzazione</li>
            </ul>

            <h2>7. Disponibilità del Servizio</h2>
            <p>
              Ci impegniamo a mantenere il Servizio disponibile, ma non garantiamo 
              un funzionamento ininterrotto. Il Servizio può essere temporaneamente 
              non disponibile per manutenzione, aggiornamenti o cause di forza maggiore.
            </p>

            <h2>8. Limitazione di Responsabilità</h2>
            <p>
              Il Servizio è fornito "così com'è" senza garanzie di alcun tipo. 
              Non siamo responsabili per:
            </p>
            <ul>
              <li>Perdita di dati o contenuti</li>
              <li>Interruzioni del servizio</li>
              <li>Danni diretti o indiretti derivanti dall'uso</li>
              <li>Azioni di terzi</li>
            </ul>
            <p>
              La responsabilità è limitata al massimo consentito dalla legge italiana.
            </p>

            <h2>9. Indennizzo</h2>
            <p>
              Ti impegni a indennizzare e tenere indenne il fornitore del Servizio 
              da qualsiasi rivendicazione, danno o spesa derivante dal tuo uso 
              improprio del Servizio o dalla violazione di questi termini.
            </p>

            <h2>10. Sospensione e Terminazione</h2>
            <p>
              Ci riserviamo il diritto di sospendere o terminare il tuo accesso 
              al Servizio in caso di:
            </p>
            <ul>
              <li>Violazione di questi termini</li>
              <li>Uso improprio o abusivo</li>
              <li>Richiesta delle autorità competenti</li>
              <li>Cessazione del Servizio</li>
            </ul>
            <p>
              Puoi terminare il tuo account in qualsiasi momento cancellando 
              i tuoi dati dal Servizio.
            </p>

            <h2>11. Modifiche ai Termini</h2>
            <p>
              Ci riserviamo il diritto di modificare questi termini. Le modifiche 
              significative saranno comunicate con almeno 30 giorni di preavviso. 
              L'uso continuato del Servizio costituisce accettazione delle modifiche.
            </p>

            <h2>12. Legge Applicabile e Foro Competente</h2>
            <p>
              Questi termini sono regolati dalla legge italiana. Per qualsiasi 
              controversia è competente il Foro di [Inserire città], salvo 
              diversa previsione di legge per i consumatori.
            </p>

            <h2>13. Disposizioni Generali</h2>
            <ul>
              <li>Se una clausola è invalida, le altre rimangono in vigore</li>
              <li>Il mancato esercizio di un diritto non costituisce rinuncia</li>
              <li>Questi termini costituiscono l'intero accordo tra le parti</li>
            </ul>

            <h2>14. Contatti</h2>
            <p>
              Per domande sui termini di servizio, contattaci a:
            </p>
            <ul>
              <li>Email: legal@listadellaspesa.app</li>
              <li>Indirizzo: [Inserire indirizzo se applicabile]</li>
            </ul>

            <h2>15. Risoluzione delle Controversie</h2>
            <p>
              In caso di controversie, incoraggiamo la risoluzione amichevole. 
              I consumatori possono rivolgersi alla piattaforma ODR europea 
              (ec.europa.eu/consumers/odr) o agli organismi di mediazione competenti.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;