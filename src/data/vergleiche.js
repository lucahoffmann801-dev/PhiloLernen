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

// ---------------------------------------------------------------------------
// "Ein Fall, alle Blickwinkel": pro Vergleich 2-3 wählbare Fallbeispiele.
// Derselbe Fall wird durch jede Position betrachtet (views ist positionsgleich
// zu items sortiert). Sprachregel: Urteile nur, wo die Folien sie vorgeben;
// sonst wird die PERSPEKTIVE gezeigt ("würde fragen ...", "aus dieser Sicht ...").
export const CASES = {
theorien: [
 {name:"Trolley: die Weiche", desc:"Ein Wagen rollt auf fünf Menschen zu. Du kannst eine Weiche stellen, dann stirbt einer auf dem Nebengleis.",
  views:[
   "Erlaubt (laut Vorlesung): Niemand wird bloß als Mittel benutzt, der eine Tod ist tragische Nebenfolge.",
   "Geboten (laut Vorlesung): 1 statt 5 — die Nutzenbilanz entscheidet, und sie ist eindeutig.",
   "Würde fragen: Welche Regel würden rationale Vertragspartner wählen, die selbst auf jedem der Gleise stehen könnten?",
   "Würde fragen: Könnten alle Betroffenen der Norm „In solchen Fällen wird umgestellt“ im fairen Diskurs zustimmen?",
   "Fragt nicht nach der Regel, sondern: Was täte hier der phronimos? Geschulte Urteilskraft statt Rechnung."]},
 {name:"Trolley: der dicke Mann", desc:"Gleiche Bilanz, andere Handlung: Du könntest einen Mann von der Brücke stoßen, sein Körper stoppt den Wagen.",
  views:[
   "Verboten (laut Vorlesung): Ein Unschuldiger wird direkt als Mittel instrumentalisiert — der Zweck heiligt die Mittel nicht.",
   "Geboten (laut Vorlesung): Die Bilanz ist identisch mit Fall 1 — für den Utilitaristen ändert sich nichts.",
   "Würde fragen: Wer unterschreibt einen Vertrag, nach dem jeder jederzeit geopfert werden darf? Er macht jeden zum möglichen Opfer.",
   "Würde fragen: Der Geopferte selbst könnte der Norm im Diskurs kaum je zustimmen — und alle Betroffenen müssen es können.",
   "Würde fragen: Was verrät es über meinen Charakter, einen Menschen mit eigenen Händen in den Tod zu stoßen?"]},
 {name:"Die Notlüge", desc:"Du lügst, um einer Freundin eine schmerzhafte Wahrheit zu ersparen.",
  views:[
   "Nicht verallgemeinerbar: Dürfte jeder so lügen, glaubte niemand mehr Zusagen — die Maxime zerstört sich selbst.",
   "Erlaubt, wenn die Lüge mehr Glück als Leid stiftet: Allein die Folgenbilanz entscheidet.",
   "Würde fragen: Unterschreiben rationale Egoisten eine Notlügen-Klausel, obwohl sie dann selbst belogen werden dürften?",
   "Würde fragen: Könnten auch die BELOGENEN der Norm „Notlügen sind okay“ unter idealen Bedingungen zustimmen?",
   "Wahrhaftigkeit ist eine Tugend — aber der praktisch Kluge wägt im Einzelfall, statt einer starren Regel zu folgen."]},
],
ki: [
 {name:"Der dicke Mann",
  views:[
   "Würde fragen: Kann ich wollen, dass „Unbeteiligte opfern, wenn es mehr rettet“ allgemeines Gesetz wird — und jeder, auch ich, jederzeit Opfer sein darf?",
   "Durchgefallen (laut Vorlesung): Der Mann wird BLOSS als Mittel benutzt — direkte Instrumentalisierung."]},
 {name:"Der Handwerker-Auftrag", desc:"Du beauftragst und bezahlst einen Handwerker.",
  views:[
   "Würde fragen: Kann ich wollen, dass „Leistung gegen faire Bezahlung kaufen“ allgemeines Gesetz wird? Die Maxime zerstört sich nicht selbst — nichts spricht dagegen.",
   "Bestanden: Er ist Mittel zum Zweck, aber freiwillig und bezahlt — zugleich als Person geachtet, nicht BLOSS Mittel."]},
 {name:"Die Notlüge",
  views:[
   "Durchgefallen: Die Maxime „Ich lüge, wenn es passt“ zerstört sich als allgemeines Gesetz selbst — niemand glaubte mehr irgendwem.",
   "Würde fragen: Der Belogene kann der Täuschung nicht zustimmen — er wird als bloßes Mittel für mein Ziel behandelt."]},
],
rationierung: [
 {name:"Ein Organ, zwei Patienten", desc:"Ein Spenderorgan. Patientin A: 30, sehr gute Prognose. Patient B: 78, mäßige Prognose, wartet länger und leidet stärker.",
  views:[
   "Patientin A: Bei ihr kauft das Organ die meisten gesunden Lebensjahre (QALYs).",
   "Losentscheid: Beide haben das gleiche Anrecht — Heilungsaussichten dürfen keine Rolle spielen.",
   "Patient B: Der schlechter Gestellte, der länger wartet und stärker leidet, hat Vorrang.",
   "Patient B: Der medizinisch Bedürftigste zuerst, unabhängig von den Erfolgsaussichten.",
   "Würde zuerst fragen: Ist eine der Erkrankungen selbstverschuldet (z. B. durch Rauchen)? Das flösse in die Verteilung ein."]},
 {name:"Das letzte Intensivbett", desc:"Grippewelle. Ein Bett, zwei Notfälle: ein junger Patient mit hoher Überlebenschance, eine schwerstkranke Patientin mit geringer.",
  views:[
   "Der junge Patient: höhere Erfolgswahrscheinlichkeit, mehr gewonnene Lebenszeit pro Ressource.",
   "Beide gleichberechtigt: Wenn nichts anderes zählt, entscheidet das Los, nicht die Prognose.",
   "Die schwerstkranke Patientin: Ihr geht es am schlechtesten, also hat sie Vorrang — auch wenn der Nutzen kleiner ist.",
   "Die schwerstkranke Patientin: Sie ist die Bedürftigste — genau das zählt hier, sonst nichts.",
   "Würde fragen, wie es zu den Erkrankungen kam — und stößt dabei auf sein Kernproblem: Kausalität ist kaum nachweisbar."]},
],
embryonen: [
 {name:"Das brennende Labor", desc:"Im Feuer: ein Koffer mit 1.000 Embryonen und ein Stockwerk höher ein Kleinkind. Du kannst nur eines retten.",
  views:[
   "Müsste konsequent den Koffer retten — 1.000 unschuldige menschliche Wesen. Dass fast niemand das täte, ist genau der Einwand der Vorlesung gegen diese Theorie.",
   "Müsste klären, ob 1.000 Träger bloß passiven Potentials ein Kind mit aktualen Fähigkeiten überwiegen — die Vorlesung führt das Experiment allerdings nur als Einwand gegen Theorie I an.",
   "Ohne Konflikt: Das Kind ist auf dem Weg zur Person mit aktuellen Interessen, die Embryonen haben keine — das Kind wird gerettet."]},
 {name:"Überzählige IVF-Embryonen", desc:"Nach einer künstlichen Befruchtung bleiben Embryonen übrig. Verwerfen?",
  views:[
   "Verboten: Verwerfen wäre das Töten unschuldigen menschlichen Lebens — ab der Verschmelzung.",
   "Problematisch: Jeder Embryo trägt das Potential zur Person. Konsequent gedacht müsste man aber auch Gameten schützen — der Harris-Einwand.",
   "Kein Verstoß gegen ein Lebensrecht: Ohne Selbstbewusstsein, zeitliche Identität und Zukunftswünsche gibt es kein aktuelles Lebensinteresse."]},
 {name:"Der Schlafende", desc:"Ein tief schlafender Mensch hat gerade keine bewussten Interessen. Hat er trotzdem ein Lebensrecht?",
  views:[
   "Selbstverständlich: Er ist ein unschuldiges menschliches Wesen — mehr braucht diese Theorie nicht.",
   "Selbstverständlich: Sein Potential ist unbestritten — er WAR ja schon alles, was er wieder sein wird.",
   "Die Nagelprobe der Theorie: Singers Antwort lautet AKTIVE Potentialität — seine Fähigkeiten ruhen nur, anders als beim Embryo, der sie erst entwickeln muss."]},
],
autonomie: [
 {name:"Der unwillige Raucher", desc:"Er greift zur Zigarette — und hasst sich dafür, denn er will dieses Verlangen nicht haben.",
  views:[
   "Autonom: Der Griff zur Zigarette ist absichtlich, verstanden und von niemandem kontrolliert — mehr verlangt die Handlungsautonomie nicht.",
   "NICHT autonom: Wunsch 1. Ordnung (rauchen) und Wunsch 2. Ordnung (dieses Wollen nicht wollen) kollidieren — Frankfurts Paradefall."]},
 {name:"Die Bluttransfusion", desc:"Eine Zeugin Jehovas lehnt aus tiefem Glauben eine lebensrettende Transfusion ab.",
  views:[
   "Wirksam: absichtlich, substantiell verstanden, ohne kontrollierende Einflüsse — alle drei Bedingungen erfüllt, die Ablehnung ist zu respektieren.",
   "Erst recht zu respektieren: Die Entscheidung ist tief in der Persönlichkeit verankert — je stärker eingebettet, desto mehr Gewicht, sogar gegen das Wohlergehen."]},
 {name:"Die OP-Einwilligung", desc:"Ein Patient unterschreibt nach dem Aufklärungsgespräch die Einwilligung zur Blinddarm-OP.",
  views:[
   "Genau ihr Fall: Absicht, substantielles Verstehen, keine Kontrolle — die Einwilligung ist gültig. Vollständiges Verstehen ist nicht nötig.",
   "Stellt hier keine Zusatzfragen: Ob der Patient insgesamt ein selbstbestimmtes Leben führt, ist für diese eine Handlung nicht gefordert."]},
],
"sh-wille": [
 {name:"Koma ohne Verfügung", desc:"Ein Patient liegt im irreversiblen Koma. Es gibt keine Patientenverfügung, sein Wille ist unbekannt. Die Behandlung wird beendet.",
  views:[
   "Liegt NICHT vor: Es gibt keinen geäußerten Sterbewunsch.",
   "GENAU dieser Fall: urteilsunfähig, Wille unbekannt — das ist nicht-freiwillige Sterbehilfe.",
   "Liegt NICHT vor: Es gibt keinen bekannten entgegenstehenden Willen."]},
 {name:"Der wiederholte Wunsch", desc:"Eine aufgeklärte, urteilsfähige Patientin bittet über Wochen immer wieder darum, sterben zu dürfen.",
  views:[
   "GENAU dieser Fall: expliziter, aufgeklärter Wille — freiwillige Sterbehilfe.",
   "Liegt NICHT vor: Die Patientin ist urteilsfähig und ihr Wille bekannt.",
   "Liegt NICHT vor: Nichts geschieht gegen ihren Willen."]},
 {name:"Gegen den dokumentierten Willen", desc:"Ein Patient hat schriftlich jede Form von Sterbehilfe abgelehnt. Sie wird dennoch durchgeführt.",
  views:[
   "Liegt NICHT vor: Der Wille zeigt in die Gegenrichtung.",
   "Liegt NICHT vor: Der Wille ist ja bekannt — nur eben ablehnend.",
   "GENAU dieser Fall: gegen den erklärten Willen — und damit laut Vorlesung immer unethisch."]},
],
"sh-handlung": [
 {name:"Beatmung wird abgeschaltet", desc:"Der Arzt drückt den Knopf, das Gerät stoppt, der Patient stirbt an seiner Grunderkrankung.",
  views:[
   "Nein: Es gibt keine gezielte tötende Intervention wie eine Giftspritze.",
   "JA (rechtlich): Sterbenlassen durch Behandlungsabbruch — obwohl faktisch ein Knopf gedrückt wird. Genau hier sitzt Birnbachers GDH-Grauzone.",
   "Nein: Es wird kein Mittel mit tödlicher Nebenwirkung gegeben.",
   "Nein: Der Patient führt nichts selbst aus."]},
 {name:"Hochdosiertes Morphin", desc:"Gegen unerträgliche Schmerzen wird die Dosis erhöht — mit dem bekannten Risiko, das Leben zu verkürzen.",
  views:[
   "Nein: Es fehlt die Tötungsabsicht — beabsichtigt ist die Linderung.",
   "Nein: Es wird gehandelt, nicht unterlassen.",
   "JA: Der Lehrbuchfall des Doppelwirkungsprinzips — Linderung gewollt, Lebensverkürzung in Kauf genommen.",
   "Nein: Die Gabe erfolgt durch das Behandlungsteam."]},
 {name:"Das Glas auf dem Nachttisch", desc:"Der Arzt stellt das tödliche Medikament bereit. Ob und wann der Patient es trinkt, entscheidet er allein.",
  views:[
   "Nein: Die letzte, tödliche Handlung führt nicht der Arzt aus.",
   "Nein: Der Arzt unterlässt nichts — er handelt sogar, aber nicht tötend.",
   "Nein: Das Medikament lindert nicht mit tödlicher Nebenwirkung, es IST das Mittel.",
   "GENAU dieser Fall: Bereitstellen ja, ausführen nein — die Kontrolle bleibt beim Sterbewilligen."]},
],
armut: [
 {name:"100 € nach der Hungersnot", desc:"Ein Spendenaufruf nach einer Hungersnot: Bist du moralisch verpflichtet, 100 € zu geben?",
  views:[
   "Ja: Du kannst Schlimmes verhindern, ohne Vergleichbares zu opfern — und Entfernung zählt nicht. Das Teichbeispiel in Geldform.",
   "Nein: „Ich habe kein moralisches Gebot zu helfen, wenn ich niemandem etwas Falsches getan habe.“ Positive Pflichten sind vertraglich nicht gesichert.",
   "Seine Theorie adressiert Institutionen und Völker, nicht deine 100 € — global kennt sie ohnehin nur eine Unterstützungspflicht für wohlgeordnete Gesellschaften.",
   "Ja, aber anders begründet: nicht Großzügigkeit, sondern Wiedergutmachung — die Institutionen, von denen du profitierst, haben die Not mit verursacht."]},
 {name:"Das Kind im Teich", desc:"Direkt vor dir ertrinkt ein Kind. Retten ruiniert nur deine Schuhe.",
  views:[
   "Retten, selbstverständlich — und Singers Pointe: Zwischen diesem Kind und dem fernen Kind besteht moralisch kein Unterschied.",
   "Würde wohl auch retten wollen — aber sein Vertrag ERZWINGT es nicht: Hilfspflichten bleiben schwach und unbestimmt.",
   "Kein Fall für seine Theorie: Sie regelt die Grundstruktur von Gesellschaften, nicht die Nothilfe am Teichrand.",
   "Sein Argument greift hier gar nicht: Du hast das Ertrinken nicht mitverursacht — Pogge zielt auf strukturelles Unrecht, nicht auf Unglücke."]},
],
umwelt: [
 {name:"Das Moor und die Straße", desc:"Ein abgelegenes Moor soll für eine Straße trockengelegt werden. Kaum ein Mensch kennt es; Frösche, Vögel und seltene Pflanzen leben dort.",
  views:[
   "Der Eingriff zerstört ein Ökosystem mit Eigenwert — rechtfertigungsbedürftig, auch wenn kein Mensch das Moor je besucht.",
   "Alle Lebewesen dort zählen — auch die seltenen Pflanzen sind moralisch betroffen, nicht nur die Tiere.",
   "Die empfindungsfähigen Tiere zählen (Frösche, Vögel) — die Pflanzen haben kein ZNS und damit keine Interessen.",
   "Zählt nur, was Menschen verlieren: Erholungsraum, Hochwasserschutz, künftiger Nutzen. Ohne das spricht wenig dagegen."]},
 {name:"Das Antibiotikum", desc:"Eine bakterielle Infektion wird mit Antibiotika behandelt — Milliarden Bakterien sterben.",
  views:[
   "Kein Fall für ihn: Es geht um keinen Eingriff in ein Ökosystem.",
   "Sein Problemfall (laut Vorlesung): Konsequent müssten auch Bakterien moralisch zählen — genau diese Ausdehnung wird als absurd eingewandt.",
   "Unproblematisch: Bakterien haben kein ZNS, empfinden nichts, haben keine Interessen.",
   "Unproblematisch: Die Gesundheit des Menschen ist das Einzige, was zählt."]},
],
klima: [
 {name:"Das Restbudget", desc:"Wie verteilt man das verbleibende CO2-Budget zwischen Deutschland und Bangladesch?",
  views:[
   "Zuerst das Existenzminimum ALLER sichern — die Kochstelle in Bangladesch ist tabu, der Luxuskonsum nicht.",
   "Gleiches Budget pro Kopf, heute wie künftig — für Deutschland hieße das: deutlich weniger als bisher.",
   "Deutschland hat die Atmosphäre historisch übernutzt und muss ausgleichen, um zum Ideal gleicher Nutzung zurückzufinden.",
   "Die heute in Deutschland Lebenden profitieren vom fossilen Wohlstand — sie zahlen mit, ob sie wollten oder nicht."]},
 {name:"Der junge Radfahrer", desc:"Ein junger Deutscher lebt bewusst emissionsarm, fährt nur Rad. Muss er trotzdem für Klimaschäden mitzahlen?",
  views:[
   "Sein Existenzminimum bleibt ohnehin unangetastet — darüber hinaus ist er nicht geschützt.",
   "Er bekommt dasselbe Pro-Kopf-Budget wie jeder andere — sein sparsamer Lebensstil verschafft ihm Spielraum darin.",
   "Als Teil des Verursacherlandes: ja. Genau hier greift die Kritik der Vorlesung — das Prinzip unterscheidet nicht zwischen „Yuppie“ und „Öko“.",
   "Ja: Er profitiert vom historisch aufgebauten Wohlstand — das Prinzip gilt ausdrücklich auch für unbewusstes Nutznießen."]},
],
fairness: [
 {name:"COMPAS", desc:"Der US-Rückfall-Score, den ProPublica untersuchte.",
  views:[
   "Würde die Hautfarbe einfach weglassen — aber Wohnort & Co. tragen sie als Proxy wieder hinein.",
   "Würde verlangen, dass die Risikoscores über die Gruppen gleich verteilt sind — unabhängig von allem anderen.",
   "VERLETZT (laut Vorlesung): falsch-positiv 45 % bei Schwarzen gegen 23 % bei Weißen — ungleiche Fehlerraten.",
   "Weitgehend erfüllt: Die Vorhersagewerte waren zwischen den Gruppen ähnlich — der Score „bedeutete dasselbe“."]},
 {name:"Der AMS-Score", desc:"Ein Arbeitsamt-Algorithmus schätzt das Langzeitarbeitslosigkeits-Risiko und steuert Förderprogramme.",
  views:[
   "Würde das Geschlecht streichen — aber die Erwerbsbiografie trägt es als Proxy wieder hinein.",
   "Eine der Fairness-Beschränkungen der Fallstudie — fairnessbeschränkte Scores führten dort insgesamt zu GRÖSSEREN Geschlechterlücken bei der Langzeitarbeitslosigkeit.",
   "Auch dieses Kriterium zählt zu den Fairness-Beschränkungen, die in der Fallstudie insgesamt schlechter abschnitten als der unbeschränkte Score.",
   "Der unbeschränkte, nach Gruppen kalibrierte Score erfüllte dieses Kriterium — und lieferte die besseren Verteilungsergebnisse."]},
],
};
