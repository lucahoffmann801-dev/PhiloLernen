// Gegenüberstellungen: dieselben Dinge nebeneinander statt einzeln.
// Inhalte ausschließlich aus dem geprüften Vorlesungsmaterial (Klausurübersicht,
// Merkblatt "Theorien normativer Ethik", Foliensätze, Gastvortrag).
// Struktur: items = die Spalten (mit Farbe), attrs = die Vergleichszeilen.

export const COMPARES = [
{id:"theorien", emoji:"🧭", title:"Die fünf Ethiktheorien", w:"Kapitel 01",
 intro:"Das Fundament. Jede Theorie beantwortet dieselbe Frage anders: Was macht eine Handlung richtig?",
 items:[{n:"Deontologie",c:"#5b7cfa"},{n:"Utilitarismus",c:"#e06d2e"},{n:"Kontraktualismus",c:"#0fa396"},{n:"Diskursethik",c:"#8f5cc9"},{n:"Tugendethik",c:"#2f9e44"}],
 attrs:[
  {label:"Vertreter", vals:["Kant, Korsgaard","Bentham, Mill, Singer","Hobbes, Rawls","Habermas, Apel","Aristoteles, Nussbaum"]},
  {label:"Die Kernfrage", vals:[
   "Ist die Handlung AN SICH richtig? Test: Was wäre, wenn das jeder täte?",
   "Maximiert sie die Summe des Glücks aller Betroffenen?",
   "Würden alle den Vertrag aus wohlüberlegtem Eigeninteresse unterschreiben?",
   "Würden alle Betroffenen im herrschaftsfreien Diskurs zustimmen?",
   "Was würde der phronimos, der praktisch Kluge, hier tun?"]},
  {label:"Was wird beurteilt?", vals:[
   "Die Absicht (Gesinnung), nicht die Folgen",
   "Die Folgen, nur die Folgen",
   "Vertraglich verhandelte Rechte und Pflichten",
   "Handlungsnormen, geprüft durch das Verfahren",
   "Charakter und Tugenden, nicht Einzelhandlungen"]},
  {label:"Zweck und Mittel", vals:[
   "Der Zweck heiligt NIEMALS die Mittel",
   "Der Zweck KANN die Mittel heiligen",
   "Sicher ist nur das Nicht-Schaden; Hilfspflichten bleiben schwach",
   "Nicht das Ergebnis zählt, sondern der faire Prozess",
   "Keine Einzelfallregel, sondern eine geschulte Haltung"]},
  {label:"Haupteinwand", vals:[
   "Rigorosität: Folgen werden ignoriert; Konflikte zwischen Pflichten",
   "Kann ungerechte Behandlung von Minderheiten fordern; Verrechnungsproblem",
   "Nur Minimalmoral; Schwarzfahrer-Problem; Mitleid kommt nicht vor",
   "Begründet keine konkreten Normen; der ideale Diskurs ist real nicht umsetzbar",
   "Keine konkrete Handlungsorientierung; was als Tugend zählt, bleibt strittig"]}],
 merke:"Den Utilitarismus verstehst du am besten als Anti-Kant: Folgen statt Absicht, Summe statt Regel, Zweck heiligt Mittel statt niemals. Wer dieses Paar hat, kann die anderen drei einordnen."},

{id:"ki", emoji:"⚖️", title:"Der Kategorische Imperativ: zwei Formeln, ein Prinzip", w:"Kapitel 01",
 intro:"Es gibt EINEN kategorischen Imperativ in mehreren Fassungen. Für die Klausur zählen diese zwei, und sie prüfen dieselbe Sache aus zwei Blickwinkeln.",
 items:[{n:"Universalisierungsformel",c:"#5b7cfa"},{n:"Selbstzweckformel",c:"#8f5cc9"}],
 attrs:[
  {label:"Wortlaut", vals:[
   "„Handle nur nach derjenigen Maxime, durch die du zugleich wollen kannst, dass sie ein allgemeines Gesetz werde.“",
   "„Handle so, dass du die Menschheit … jederzeit zugleich als Zweck, niemals bloß als Mittel brauchest.“"]},
  {label:"Die Test-Frage", vals:[
   "Was wäre, wenn das JEDER täte?",
   "Wird hier jemand BLOSS als Werkzeug benutzt?"]},
  {label:"Was wird geprüft?", vals:[
   "Die Regel (Maxime) hinter deiner Handlung",
   "Der Umgang mit den betroffenen Menschen"]},
  {label:"Im Trolley-Fall", vals:[
   "Weiche stellen: bestanden — der eine Tod ist Nebenfolge, keine Regel dagegen",
   "Dicker Mann: durchgefallen — er wird direkt als Mittel instrumentalisiert"]},
  {label:"Daraus folgt", vals:[
   "Das Prinzip der Verallgemeinerbarkeit",
   "Menschenwürde und Instrumentalisierungsverbot"]}],
 merke:"Kategorisch heißt: ohne Wenn und Aber, unabhängig von den Folgen. Beide Formeln sind Fassungen DESSELBEN Imperativs — fällt eine durch, ist die Handlung falsch."},

{id:"rationierung", emoji:"🏥", title:"Die fünf Rationierungskriterien", w:"Kapitel 02",
 intro:"Wer bekommt das knappe Gut? Fünf Antworten, jede mit einer anderen Ethik im Rücken.",
 items:[{n:"Effizienz (QALY)",c:"#e06d2e"},{n:"Chancengleichheit",c:"#0fa396"},{n:"Ausgleichende Gerechtigkeit",c:"#8f5cc9"},{n:"Mitleid / Bedürftigkeit",c:"#d98f0e"},{n:"Eigenverantwortung",c:"#5b6472"}],
 attrs:[
  {label:"Die Idee", vals:[
   "Ressourcen dorthin, wo sie am meisten gesunde Lebenszeit kaufen",
   "Jeder hat das gleiche Anrecht, unabhängig von Heilungsaussichten",
   "Benachteiligte und Leidende erhalten Vorrang",
   "Der medizinisch Bedürftigste bekommt das Gut, egal wie die Aussichten stehen",
   "Selbstverursachte Krankheiten fallen aus der Solidarfinanzierung"]},
  {label:"Ethische Basis", vals:["Utilitarismus","Egalitarismus","Prioritarismus","Fürsorge-Ethik","Liberalismus"]},
  {label:"Das Problem", vals:[
   "Benachteiligt Ältere systematisch; ist zudem nicht vollständig utilitaristisch",
   "Bei echter Knappheit kaum umsetzbar; ignoriert die Effizienz",
   "Knappes Gut kann dorthin gehen, wo es minimal nützt, statt zu heilen",
   "Dasselbe Effizienzproblem wie bei der ausgleichenden Gerechtigkeit",
   "Freiheit fraglich, Kausalität kaum nachweisbar, vergiftet das Arztverhältnis"]}],
 merke:"Die Empfehlung der Vorlesung: der Mix aus 1 + 2 + 5 (Effizienz, Chancengleichheit, Eigenverantwortung) als Brückenprinzipien zwischen den Ethiktypen."},

{id:"embryonen", emoji:"🧬", title:"Drei Theorien zum Embryonenstatus", w:"Kapitel 03",
 intro:"Ab wann zählt ein Mensch moralisch? Drei Antworten, drei Angriffsflächen.",
 items:[{n:"I: Heiligkeit des Lebens",c:"#e0566e"},{n:"II: Potentialität",c:"#d98f0e"},{n:"III: Aktuelles Lebensinteresse",c:"#5b7cfa"}],
 attrs:[
  {label:"Kernthese", vals:[
   "Unschuldiges menschliches Leben zu töten ist unrecht, also auch Föten",
   "Embryonen sind zu schützen, weil sie POTENTIELL Wesen mit wertvollen Eigenschaften sind",
   "Rechte schützen aktuelle Interessen; ein Lebensinteresse setzt Personensein voraus (Singer)"]},
  {label:"Lebensrecht ab …", vals:[
   "der Empfängnis — aber wo genau beginnt der Mensch?",
   "der Existenz des Potentials, also praktisch der Zygote",
   "dem Personensein, also ca. 3–6 Monate; Hoersters Kompromiss: pragmatisch ab Geburt"]},
  {label:"Haupteinwände", vals:[
   "Zwillingsbildung: Zygote ≠ Individuum; Speziesismus-Vorwurf; brennendes Labor",
   "Potentielles X ≠ aktuelles X (Singer); Gameten-Einwand → Verhütungsverbot (Harris); Klon-Einwand gegen Marquis",
   "Der Schlafende hat auch kein aktuelles Interesse — Singers Antwort: aktive vs. passive Potentialität"]}],
 merke:"Das brennende Labor ist DAS Gedankenexperiment gegen Theorie I: 1.000 Embryonen im Koffer gegen ein Kleinkind — fast jeder rettet das Kind."},

{id:"autonomie", emoji:"🖊️", title:"Handlungsautonomie vs. Personale Autonomie", w:"Kapitel 04",
 intro:"Die Original-Klausurfalle. Zwei Begriffe, zwei völlig verschiedene Fragen.",
 items:[{n:"Handlungsautonomie",c:"#d98f0e"},{n:"Personale Autonomie",c:"#8f5cc9"}],
 attrs:[
  {label:"Die Frage", vals:[
   "Wann ist eine einzelne HANDLUNG autonom?",
   "Wann ist die ganze PERSON autonom?"]},
  {label:"Die Bedingungen", vals:[
   "Absichtlichkeit, Verstehen, keine kontrollierenden Einflüsse — substantiell, nicht vollständig (Beauchamp, Childress, Faden)",
   "Frankfurt: Wünsche 1. und 2. Ordnung kohärieren; Ekstrom: ganzes Netzwerk kohärenter Wünsche plus kontrafaktische Prüfung"]},
  {label:"Wofür reicht sie?", vals:[
   "Für medizinische Entscheidungen: Aufklärung + informed consent",
   "Für die Frage, ob jemand insgesamt selbstbestimmt lebt — der unwillige Raucher scheitert hier"]}],
 merke:"Wörtlich aus den Klausurhinweisen: „Handlungsautonomie stellt unstrittig die Autonomie von Personen sicher“ ist FALSCH. Sie sichert Handlungen, nicht Personen."},

{id:"sh-wille", emoji:"🕊️", title:"Sterbehilfe I: der Wille des Patienten", w:"Kapitel 05",
 intro:"Drei Wörter, die fast gleich klingen und in der Klausur gern vertauscht werden.",
 items:[{n:"Freiwillig",c:"#2f9e44"},{n:"Nicht-freiwillig",c:"#d98f0e"},{n:"Unfreiwillig",c:"#e5484d"}],
 attrs:[
  {label:"Was heißt das?", vals:[
   "Der Patient will explizit sterben, aufgeklärter Wille liegt vor",
   "Der Patient ist urteilsunfähig, sein Wille ist UNBEKANNT (z. B. irreversibles Koma)",
   "GEGEN den erklärten Willen des Patienten"]},
  {label:"Merkzeichen", vals:[
   "Wille dokumentiert oder geäußert",
   "Die Komafalle: nicht-freiwillig heißt NICHT „gegen den Willen“",
   "Gilt immer als unethisch, ohne Ausnahme"]}],
 merke:"Die Falle steckt im Wort: nicht-freiwillig = ohne bekannten Willen. Unfreiwillig = gegen den Willen."},

{id:"sh-handlung", emoji:"⚕️", title:"Sterbehilfe II: die Art der Handlung", w:"Kapitel 05",
 intro:"Vier Wege, an denen sich die ganze Debatte aufhängt.",
 items:[{n:"Aktiv",c:"#e5484d"},{n:"Passiv",c:"#0fa396"},{n:"Indirekt",c:"#d98f0e"},{n:"Beihilfe zum Suizid",c:"#5b6472"}],
 attrs:[
  {label:"Was passiert?", vals:[
   "Töten durch gezielte Intervention, etwa die Giftspritze",
   "Sterbenlassen durch Unterlassen: Beatmung abschalten, Ernährung einstellen",
   "Hohe Schmerzmittel-Dosen verkürzen das Leben als Nebenwirkung",
   "Der Arzt stellt das Mittel bereit, der Patient handelt selbst"]},
  {label:"Der feine Unterschied", vals:[
   "Enthält eine TÖTUNGSABSICHT",
   "Der Knopfdruck am Gerät zählt rechtlich als passiv — Birnbachers GDH-Grauzone",
   "Doppelwirkungsprinzip: gewollt ist die Linderung, in Kauf genommen der frühere Tod",
   "Die letzte Kontrolle bleibt beim Sterbewilligen"]}],
 merke:"ASH will den Tod, PSH und indirekte SH nehmen ihn nur in Kauf. Genau daran hängen die ethischen Argumente gegen die aktive Sterbehilfe."},

{id:"armut", emoji:"🌍", title:"Vier Antworten auf die Weltarmut", w:"Kapitel 06",
 intro:"Muss ich spenden? Vier Denker, vier grundverschiedene Begründungen.",
 items:[{n:"Singer",c:"#e06d2e"},{n:"Narveson",c:"#0fa396"},{n:"Rawls",c:"#5b7cfa"},{n:"Pogge",c:"#8f5cc9"}],
 attrs:[
  {label:"Pflichttyp", vals:[
   "Starke POSITIVE Pflicht: aktiv helfen",
   "Nur NEGATIVE Pflichten sind gesichert: nicht schaden reicht",
   "Unterstützungspflicht nur für wohlgeordnete Gesellschaften",
   "NEGATIVE Pflicht: wir schädigen bereits und müssen es wiedergutmachen"]},
  {label:"Kernthese", vals:[
   "Teichbeispiel: Schlechtes verhindern, wenn es ohne vergleichbares Opfer geht; Entfernung zählt nicht",
   "„Ich habe kein moralisches Gebot zu helfen, wenn ich niemandem etwas Falsches getan habe.“",
   "National Egalitarist, global keine Verteilungsgerechtigkeit",
   "Weltarmut geht auf Institutionen der Industrieländer zurück; Rohstoffdividende als Ausgleich"]},
  {label:"Kritik daran", vals:[
   "Überforderung — Williams: persönliche Projekte und Integrität gehen unter",
   "Bloß Minimalmoral aus Eigeninteresse",
   "Die berühmteste Gerechtigkeitstheorie ignoriert das größte Gerechtigkeitsproblem",
   "Positive Pflichten aus negativen herzuleiten überzeugt nicht vollständig"]}],
 merke:"Der Klausur-Kontrast: Singer sagt „ich muss helfen“ (positiv), Pogge sagt „ich tue Unrecht“ (negativ). Kompromiss der Vorlesung: die 5-%-Norm."},

{id:"umwelt", emoji:"🌿", title:"Die vier umweltethischen Positionen", w:"Kapitel 07",
 intro:"Eine Treppe von weit nach eng: Wer zählt moralisch?",
 items:[{n:"Ökozentrismus",c:"#0fa396"},{n:"Biozentrismus",c:"#2f9e44"},{n:"Pathozentrismus",c:"#8f5cc9"},{n:"Anthropozentrismus",c:"#5b6472"}],
 attrs:[
  {label:"Wer zählt?", vals:[
   "Ganze Ökosysteme, auch ohne Betrachter",
   "Alle Lebewesen, auch Pflanzen",
   "Alle EMPFINDUNGSFÄHIGEN Wesen (mit ZNS)",
   "Nur der Mensch und seine Interessen"]},
  {label:"Vertreter", vals:[
   "Naess, Leopold, Rolston",
   "Schweitzer, Goodpaster, Taylor",
   "Feinberg, Singer, Birnbacher",
   "Kant, Hoerster, Stemmer"]},
  {label:"Das Problem", vals:[
   "Wer ist Wertträger ohne Subjekt? Komplexität und Einzigartigkeit bleiben unbegründet",
   "Pflanzen ohne ZNS haben keine Interessen; bei Bakterien wird es absurd",
   "— das Fazit der Vorlesung: am stärksten begründet —",
   "Speziesismus-Vorwurf; Rechte zukünftiger Generationen ohne Pflichten?"]}],
 merke:"Merkbild Reichweiten-Treppe: Öko (alles) → Bio (alles Lebendige) → Patho (alles Fühlende) → Anthro (nur wir). Die Vorlesung wählt Stufe drei."},

{id:"klima", emoji:"🌡️", title:"Vier Prinzipien der Klimagerechtigkeit", w:"Kapitel 08",
 intro:"Wem gehört die Atmosphäre, und wer zahlt für die Vergangenheit?",
 items:[{n:"Subsistenzemission",c:"#2f9e44"},{n:"Gleiches Pro-Kopf-Recht",c:"#5b7cfa"},{n:"Verursacherprinzip",c:"#e06d2e"},{n:"Nutznießerprinzip",c:"#8f5cc9"}],
 attrs:[
  {label:"Kernidee", vals:[
   "Das Existenzminimum aller heutigen und zukünftigen Menschen ist tabu",
   "Jeder Mensch, heute wie künftig, darf gleich viel emittieren",
   "Wer die Atmosphäre übernutzt hat, muss ausgleichen (die WG-Abrechnung)",
   "Wer vom historischen Wohlstand profitiert, zahlt — auch bei unbewusstem Nutznießen"]},
  {label:"Die Kritik", vals:[
   "Wie hoch liegt das Subsistenzniveau? Dürfen Verschmutzer unbegrenzt belastet werden?",
   "Regionale Unterschiede (mehr Heizen im Norden); globale Umsetzbarkeit fraglich",
   "Verantwortung erst ab Kenntnis (ca. 1990); kein Unterschied Yuppie/Öko; viele Verursacher tot",
   "Wohlstand hat viele Ursachen, die Gewichtung ist unlösbar; viele Nutznießer tot"]}],
 merke:"VUP fragt: Wer hat den Dreck GEMACHT? NP fragt: Wer WOHNT im Haus, das damit gebaut wurde? Beide scheitern teils an den Toten."},

{id:"fairness", emoji:"🤖", title:"Der Fairness-Zoo aus dem Gastvortrag", w:"Gastvortrag",
 intro:"Vier Kriterien dafür, wann ein Algorithmus fair ist — und warum nicht alle zugleich gehen.",
 items:[{n:"Anti-Klassifikation",c:"#5b6472"},{n:"Independence",c:"#0fa396"},{n:"Separation",c:"#e06d2e"},{n:"Sufficiency",c:"#8f5cc9"}],
 attrs:[
  {label:"Die Idee", vals:[
   "Das geschützte Merkmal einfach weglassen („Fairness durch Unwissenheit“)",
   "Der Score ist statistisch unabhängig von der Gruppe",
   "Gleiche FEHLERRATEN für alle Gruppen (Score ⊥ Gruppe, gegeben Ergebnis)",
   "Der Score BEDEUTET für alle Gruppen dasselbe (Ergebnis ⊥ Gruppe, gegeben Score)"]},
  {label:"Merkzeichen", vals:[
   "Die naive erste Idee",
   "Gruppenzugehörigkeit verrät nichts über den Score",
   "COMPAS verletzte genau das: falsch-positiv 45 % vs. 23 %",
   "Folgt aus der Kalibrierung nach Gruppen"]},
  {label:"Der Haken", vals:[
   "Scheitert an Proxy-Variablen (Postleitzahl!) und kann Ungleichheit zementieren",
   "Ignoriert echte Unterschiede in den Grundraten",
   "Bei ungleichen Grundraten unvereinbar mit Sufficiency",
   "Bei ungleichen Grundraten unvereinbar mit Separation"]}],
 merke:"Das Unmöglichkeitsergebnis: Sind die Grundraten ungleich und der Klassifikator nicht perfekt, gehen Separation und Sufficiency NIE zugleich. Man muss wählen."},
];
