import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

void i18n
  .use(initReactI18next)
  .init({
    lng: 'de',
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      de: {
        translation: {
          title: 'Sudoku für ein klares Denken',
          subtitle: 'Täglich trainieren, entspannt bleiben und Ihr Gedächtnis stärken.',
          boardLabel: 'Sudoku Spielfeld',
          newGame: 'Neues Spiel',
          dailyChallenge: 'Tägliches Rätsel',
          chooseDifficulty: 'Schwierigkeitsgrad wählen',
          loading: 'Das Rätsel wird vorbereitet …',
          hint: 'Hinweis erhalten',
          clearCell: 'Eingabe löschen',
          noteMode: 'Notizenmodus',
          highContrast: 'Hoher Kontrast',
          highlightErrors: 'Fehler sofort anzeigen',
          fontSize: 'Schriftgröße',
          fontSizeNormal: 'Normal',
          fontSizeLarge: 'Groß',
          fontSizeExtra: 'Sehr groß',
          adsPlaceholderTitle: 'Werbefläche',
          adsPlaceholderBody: 'Hier können Sie nach Eingabe Ihrer AdSense-IDs Werbung platzieren.',
          statistics: 'Fortschritt',
          emptyStatistics: 'Noch keine gelösten Rätsel. Viel Freude beim Spielen!',
          puzzleComplete: 'Ausgezeichnet! Sie haben das Rätsel gelöst.',
          nextHintAnnouncement: 'Hinweis wurde eingetragen.',
          hintUnavailable: 'Alle Felder sind bereits richtig ausgefüllt.',
          cellGiven: 'Vorgegebenes Feld.',
          cellEmpty: 'Leeres Feld.',
          cellValue: 'Enthält die Zahl {{value}}.',
          rowLabel: 'Zeile {{row}}',
          columnLabel: 'Spalte {{col}}',
          skipToContent: 'Zum Hauptinhalt springen',
          boardInstructions:
            'Wählen Sie ein Feld und tragen Sie die gewünschte Zahl über die Tastatur oder die Schaltflächen ein.',
          controlsHeading: 'Steuerung',
          modeDescription: 'Tägliches Rätsel oder zufälliges Spiel auswählen.',
          difficultyHelper: 'Der Schwierigkeitsgrad bestimmt die Anzahl der vorgegebenen Felder.',
          noteModeDescription: 'Im Notizenmodus werden Zahlen als kleine Hinweise gespeichert.',
          highContrastDescription: 'Kontrastreiche Farben für bessere Lesbarkeit aktivieren.',
          highlightErrorsDescription: 'Falsch eingetragene Zahlen sofort markieren.',
          fontSizeDescription: 'Schriftgröße für bequeme Lesbarkeit einstellen.',
          numberPadHeading: 'Eingabefeld',
          numberPadDescription: 'Zahlen eingeben oder löschen. Die Tastatur-Eingabe ist ebenfalls möglich.',
          clearAction: 'Eingabe löschen',
          hintAction: 'Hinweis eintragen',
          hintDescription: 'Hilft beim nächsten leeren Feld.',
          adsInfo:
            'Hinterlegen Sie Ihre Google AdSense Client- und Slot-IDs in der Datei .env, um hier Werbung zu schalten.',
          statisticsSolved: 'Gelöste Rätsel',
          statisticsPlaceholder: 'Lösungen werden hier angezeigt, sobald Sie ein Rätsel abgeschlossen haben.',
          selectedDifficulty: 'Aktuelle Stufe: {{difficulty}}',
          loadingBoard: 'Bitte warten Sie, Ihr Sudoku wird vorbereitet.',
          keyboardHelp:
            'Nutzen Sie die Pfeiltasten zur Navigation, die Zahlen 1–9 zur Eingabe sowie Entfernen, um ein Feld zu leeren.',
          helpButtonLabel: 'Spielanleitung öffnen',
          helpDialogTitle: 'Spielanleitung',
          helpDialogIntro: 'So bedienen Sie das Sudoku Schritt für Schritt:',
          helpDialogSteps: [
            'Wählen Sie ein Feld mit einem Klick oder den Pfeiltasten aus.',
            'Tragen Sie Zahlen 1–9 per Tastatur oder Eingabefeld ein; mit Entfernen löschen Sie einen Eintrag.',
            'Aktivieren Sie den Notizenmodus, um kleine Markierungen zu setzen.',
            'Nutzen Sie den Hinweis-Button, falls Sie Unterstützung benötigen.',
          ],
          helpDialogClose: 'Fenster schließen',
          celebrationHeadline: 'Großartig gelöst!',
          celebrationSubtext:
            'Sie haben das Rätsel erfolgreich abgeschlossen. Gönnen Sie sich einen Moment zum Feiern oder starten Sie ein neues Spiel.',
          confirmResetTitle: 'Neues Rätsel starten?',
          confirmResetBody: 'Ihre aktuellen Eingaben gehen verloren, wenn Sie fortfahren. Möchten Sie wirklich ein anderes Rätsel öffnen?',
          confirmResetCancel: 'Abbrechen',
          confirmResetConfirm: 'Fortfahren',
          todayStatus: 'Heutiger Stand',
          todaySolved: 'Sie haben das heutige Rätsel bereits gelöst. Herzlichen Glückwunsch!',
          todayPending: 'Heutiges Rätsel offen – Schwierigkeitsgrad: {{difficulty}}.',
          historyHeading: 'Ihre zuletzt gelösten Rätsel',
          difficulty: {
            leicht: 'Leicht',
            mittel: 'Mittel',
            schwer: 'Schwer',
            meister: 'Meisterlich',
          },
          mode: {
            random: 'Zufälliges Spiel',
            daily: 'Tägliches Rätsel',
          },
        },
      },
    },
  })

export default i18n
