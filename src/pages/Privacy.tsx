import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy: React.FC = () => {
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
              Informativa sulla Privacy
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
            </p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2>1. Titolare del Trattamento</h2>
            <p>
              Il titolare del trattamento dei dati personali è Lista della Spesa App.
              Per qualsiasi comunicazione relativa al trattamento dei dati personali, 
              è possibile contattarci tramite i canali indicati nella sezione "Contatti".
            </p>

            <h2>2. Tipologie di Dati Raccolti</h2>
            <p>Raccogliamo e trattiamo le seguenti categorie di dati personali:</p>
            <ul>
              <li><strong>Dati di registrazione:</strong> email, nome utente</li>
              <li><strong>Dati di utilizzo:</strong> liste della spesa create, prodotti aggiunti</li>
              <li><strong>Dati tecnici:</strong> indirizzo IP, tipo di browser, sistema operativo</li>
            </ul>

            <h2>3. Finalità del Trattamento</h2>
            <p>I dati personali sono trattati per le seguenti finalità:</p>
            <ul>
              <li>Fornire il servizio di gestione liste della spesa</li>
              <li>Gestire la registrazione e l'autenticazione degli utenti</li>
              <li>Consentire la condivisione delle liste tra utenti</li>
              <li>Migliorare la sicurezza e le funzionalità del servizio</li>
              <li>Rispettare gli obblighi di legge</li>
            </ul>

            <h2>4. Base Giuridica del Trattamento</h2>
            <p>Il trattamento dei dati personali si basa su:</p>
            <ul>
              <li><strong>Consenso:</strong> per la registrazione e l'utilizzo del servizio</li>
              <li><strong>Esecuzione del contratto:</strong> per fornire i servizi richiesti</li>
              <li><strong>Interesse legittimo:</strong> per la sicurezza e il miglioramento del servizio</li>
            </ul>

            <h2>5. Conservazione dei Dati</h2>
            <p>
              I dati personali sono conservati per il tempo necessario al raggiungimento 
              delle finalità per cui sono stati raccolti. In particolare:
            </p>
            <ul>
              <li>Dati di registrazione: fino alla cancellazione dell'account</li>
              <li>Dati di utilizzo: fino alla cancellazione dell'account o per 2 anni dall'ultimo accesso</li>
              <li>Dati tecnici: per un massimo di 12 mesi</li>
            </ul>

            <h2>6. Condivisione dei Dati</h2>
            <p>
              I dati personali non sono venduti, affittati o ceduti a terzi. 
              Possono essere condivisi solo nei seguenti casi:
            </p>
            <ul>
              <li>Con altri utenti, limitatamente alle liste condivise</li>
              <li>Con fornitori di servizi tecnici (Firebase/Google) per il funzionamento dell'app</li>
              <li>Quando richiesto dalla legge o dalle autorità competenti</li>
            </ul>

            <h2>7. Diritti dell'Interessato</h2>
            <p>In conformità al GDPR, hai diritto a:</p>
            <ul>
              <li><strong>Accesso:</strong> ottenere informazioni sui tuoi dati personali</li>
              <li><strong>Rettifica:</strong> correggere dati inesatti o incompleti</li>
              <li><strong>Cancellazione:</strong> richiedere la cancellazione dei tuoi dati</li>
              <li><strong>Limitazione:</strong> limitare il trattamento in determinate circostanze</li>
              <li><strong>Portabilità:</strong> ricevere i tuoi dati in formato strutturato</li>
              <li><strong>Opposizione:</strong> opporti al trattamento per motivi legittimi</li>
              <li><strong>Revoca del consenso:</strong> revocare il consenso in qualsiasi momento</li>
            </ul>

            <h2>8. Sicurezza dei Dati</h2>
            <p>
              Implementiamo misure tecniche e organizzative appropriate per proteggere 
              i dati personali da accessi non autorizzati, perdita, distruzione o 
              divulgazione accidentale, inclusi:
            </p>
            <ul>
              <li>Crittografia dei dati in transito e a riposo</li>
              <li>Autenticazione sicura tramite Firebase Auth</li>
              <li>Controlli di accesso basati su ruoli</li>
              <li>Monitoraggio e logging delle attività</li>
            </ul>

            <h2>9. Trasferimenti Internazionali</h2>
            <p>
              I dati possono essere trasferiti e trattati in paesi al di fuori dello 
              Spazio Economico Europeo tramite i servizi Firebase/Google, che garantiscono 
              adeguate misure di protezione conformi al GDPR.
            </p>

            <h2>10. Cookie e Tecnologie Simili</h2>
            <p>
              Utilizziamo cookie tecnici necessari per il funzionamento del servizio. 
              Non utilizziamo cookie di profilazione o di terze parti per scopi pubblicitari.
            </p>

            <h2>11. Modifiche alla Privacy Policy</h2>
            <p>
              Ci riserviamo il diritto di modificare questa informativa. 
              Le modifiche saranno comunicate tramite pubblicazione sul sito 
              e, se significative, tramite email.
            </p>

            <h2>12. Contatti</h2>
            <p>
              Per esercitare i tuoi diritti o per qualsiasi domanda relativa al 
              trattamento dei dati personali, puoi contattarci tramite:
            </p>
            <ul>
              <li>Email: privacy@listadellaspesa.app</li>
              <li>Indirizzo: [Inserire indirizzo se applicabile]</li>
            </ul>

            <h2>13. Autorità di Controllo</h2>
            <p>
              Hai il diritto di presentare reclamo al Garante per la Protezione 
              dei Dati Personali (www.gpdp.it) se ritieni che il trattamento 
              dei tuoi dati personali violi la normativa vigente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;