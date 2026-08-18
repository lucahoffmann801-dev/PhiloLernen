// Klausur, Lernplan, Level, Verbindungen ("Roter Faden").

export const EXAM_TS = new Date(2026, 7, 31, 9, 0, 0).getTime(); // 31.08.2026

export const LEVELS = [
 {xp:0,   title:"Ersti"},
 {xp:60,  title:"Bib-Stammgast"},
 {xp:150, title:"Tutorium-Talent"},
 {xp:280, title:"HiWi"},
 {xp:450, title:"Hauptseminar-Held"},
 {xp:660, title:"Doktorand"},
 {xp:900, title:"Gesangs Liebling"},
 {xp:1200,title:"Prof-Schreck"},
];
export const DAILY_GOAL = 50; // XP

export const FORMAT = {
 typ1:{title:"Aufgabentyp I – Wahr/Falsch (2 PKT)",
  text:"Thesen werden als wahr oder falsch klassifiziert. Die Zuordnung muss in einem kurzen Begründungssatz dargelegt werden. Die Aufgabe ist nur richtig, wenn eine vernünftige Begründung geliefert wird. Die Thesen werden auch aus den Gastvorträgen gewonnen.",
  bsp:[["Aktives Tun verursacht Ereignisse nicht allein.","Richtig: Auch Unterlassungen verursachen, z. B. unterlassene Sauerstoffzufuhr an der Beatmungsmaschine."],
       ["Unter „Überlegungsgleichgewicht“ versteht man einen Abwägungsprozess zwischen verschiedenen Theorien.","Falsch: Abwägungsprozess zwischen Theorie und Intuition."]]},
 typ2:{title:"Aufgabentyp II – Frage in einem Satz (3 PKT)",
  text:"Kurze Fragen, die in einem Satz zu beantworten sind.",
  bsp:[["Was ist das Ziel von Handlungsautonomie?","Sie soll die Autonomie von Handlungen, nicht Personen sicherstellen."]]},
 regeln:["Alle Fragen zielen auf wichtige Aussagen und Zusammenhänge, nicht auf Detailfragen.",
  "Es reicht, die Folien verstehend zu lernen. Formulierungen müssen nicht auswendig gelernt werden.",
  "Gastvorträge gehören zum Stoff; dort werden nur Kernpositionen abgefragt.",
  "Fremdwörterbücher sind zugelassene Hilfsmittel.",
  "Alle Fragen beziehen sich auf den Vorlesungsstoff, nicht auf Wikipedia oder andere Quellen."]};

// Roter Faden: dieselbe Idee quer durch die Vorlesungen.
export const THREADS = [
 {id:"t1", emoji:"⚖️", title:"Der Utilitarismus zieht sich durch alles",
  sub:"Von Bentham bis zum Arbeitsamt-Algorithmus",
  nodes:[
   {w:"Kap. 01", t:"Die Theorie", p:"Nutzensumme aller Betroffenen maximieren. Der Zweck kann die Mittel heiligen."},
   {w:"Kap. 02", t:"QALY & Effizienzkriterium", p:"Angewandter Utilitarismus: Ressourcen dorthin, wo sie am meisten gesunde Lebenszeit kaufen."},
   {w:"Kap. 06", t:"Singers Spendepflicht", p:"Der bekannteste lebende Utilitarist zieht die Konsequenz für die Weltarmut."},
   {w:"Gastvortrag", t:"Die Hawks", p:"Der österreichische AMS-Vorschlag ist das Effizienzkriterium in Code gegossen."}]},
 {id:"t2", emoji:"🚫", title:"Kant und das Instrumentalisierungsverbot",
  sub:"Niemals bloß als Mittel",
  nodes:[
   {w:"Kap. 01", t:"Selbstzweckformel", p:"Menschen nie bloß als Mittel gebrauchen. Deshalb: Nein im Fall des dicken Mannes."},
   {w:"Kap. 05", t:"Sterbehilfe", p:"Deontologische Bedenken: Tötungsabsicht wiegt schwerer als Inkaufnahme des Todes."},
   {w:"Kap. 07", t:"Anthropozentrismus", p:"Kant taucht wieder auf: Nur Vernunftwesen sind moralische Objekte."},
   {w:"Kap. 08", t:"Gardiner gegen CE", p:"Manche Übel sind zu groß, um den Zweck die Mittel heiligen zu lassen. Reine Deontologie."}]},
 {id:"t3", emoji:"🤝", title:"Negative vs. positive Pflichten",
  sub:"Die vielleicht wichtigste Unterscheidung des Semesters",
  nodes:[
   {w:"Kap. 01", t:"Kontraktualismus", p:"Im Vertrag gut gesichert: nicht schaden. Schwach gesichert: helfen."},
   {w:"Kap. 05", t:"Tun vs. Unterlassen", p:"Dieselbe Struktur: Aktives Töten (Verletzung negativer Pflicht) vs. Sterbenlassen."},
   {w:"Kap. 06", t:"Narveson vs. Singer vs. Pogge", p:"Narveson: keine starke Hilfspflicht. Singer: doch, positiv. Pogge: egal, wir verletzen schon die negative."}]},
 {id:"t4", emoji:"🐒", title:"Singer: ein Prinzip, drei Debatten",
  sub:"Interessen empfindungsfähiger Wesen",
  nodes:[
   {w:"Kap. 03", t:"Personenbegriff", p:"Lebensrecht setzt aktuelle Interessen voraus, Embryonen haben keine. Speziesismus-Vorwurf."},
   {w:"Kap. 06", t:"Teichbeispiel", p:"Räumliche Nähe darf moralisch keine Rolle spielen, Interessen zählen gleich."},
   {w:"Kap. 07", t:"Pathozentrismus", p:"Auch die Speziesgrenze darf keine Rolle spielen: Alle empfindungsfähigen Wesen zählen."}]},
 {id:"t5", emoji:"🧑‍⚖️", title:"Rawls' zwei Gesichter",
  sub:"Methode, Gleichheit und eine berühmte Leerstelle",
  nodes:[
   {w:"Kap. 01", t:"Überlegungsgleichgewicht", p:"Seine Methode: Theorie und Intuition ins Gleichgewicht bringen."},
   {w:"Kap. 02", t:"Egalitarismus", p:"Das Chancengleichheits-Kriterium der Rationierung ist rawlsianisch."},
   {w:"Kap. 06", t:"Die Leerstelle", p:"National Egalitarist, global nicht. Kritik: Die berühmteste Gerechtigkeitstheorie ignoriert das größte Gerechtigkeitsproblem."}]},
 {id:"t6", emoji:"🎿", title:"Dammbruch & Co: Argumentformen erkennen",
  sub:"Wer die Form kennt, erkennt sie überall",
  nodes:[
   {w:"Kap. 05", t:"Dammbruchargument", p:"A ist okay, aber ein wahrscheinlicher Schritt zum katastrophalen B. Kritik: Wahrscheinlichkeit begründen!"},
   {w:"Kap. 06", t:"Naturalistischer Fehlschluss", p:"Vom Sein aufs Sollen schließen („Sterben ist natürlich“). Singer kontert damit Einwand b."},
   {w:"Kap. 01", t:"Selbstwiderspruch", p:"Der starke Egoismus scheitert an sich selbst: Man kann nicht wollen, dass alle egoistisch sind."}]},
 {id:"t7", emoji:"🏥", title:"Rationierung, jetzt mit Algorithmus",
  sub:"Kapitel 02 und der Gastvortrag sind dasselbe Problem",
  nodes:[
   {w:"Kap. 02", t:"Die fünf Kriterien", p:"Effizienz (Utilitarismus) vs. ausgleichende Gerechtigkeit (Prioritarismus): Wer bekommt das knappe Gut?"},
   {w:"Gastvortrag", t:"Hawks vs. Doves", p:"Exakt dieselbe Frage am Arbeitsamt: Effizienz (Österreich) gegen Priorität für die Schwächsten (Belgien)."},
   {w:"Gastvortrag", t:"Die Pointe", p:"Empirisch brachte die Effizienzstrategie nicht einmal Effizienz: Dove Supremacy."}]},
];

// 13-Tage-Plan (18.08.–30.08.), Klausur am 31.08.
export const PLAN = [
 {d:"18.08.",w:"Di",h:"Kapitel 01 – Grundtypen",m:"",
  t:["Lernpfad: alle vier Lektionen von Kapitel 01","Boss-Check Kapitel 01","Die 5 Ethiktypen aus dem Kopf: Vertreter + Kernthese"]},
 {d:"19.08.",w:"Mi",h:"Kapitel 02 – Rationierung",m:"",
  t:["Lernpfad: Kapitel 02 komplett","Boss-Check Kapitel 02","Training: fällige Karten","Die 5 Kriterien mit ethischer Basis aufsagen"]},
 {d:"20.08.",w:"Do",h:"Kapitel 03 – Embryonen",m:"",
  t:["Lernpfad: Kapitel 03 komplett","Boss-Check Kapitel 03","Training: fällige Karten","Drei Statustheorien mit je zwei Einwänden"]},
 {d:"21.08.",w:"Fr",h:"Kapitel 04 – Autonomie",m:"Medizinethik zur Hälfte",
  t:["Lernpfad: Kapitel 04 komplett","Boss-Check Kapitel 04","Training: fällige Karten","Handlungs- vs. personale Autonomie in drei Sätzen"]},
 {d:"22.08.",w:"Sa",h:"Kapitel 05 – Sterbehilfe",m:"",
  t:["Lernpfad: Kapitel 05 komplett","Boss-Check Kapitel 05","Training: fällige Karten","Die sieben Sterbehilfe-Typen sicher unterscheiden"]},
 {d:"23.08.",w:"So",h:"Festigen: Kapitel 01–05",m:"Block Medizinethik steht",
  t:["Training: Alles gemischt, nur Kapitel 01–05","Modus „Nur Fehler“ leeren","Kein neuer Stoff heute"]},
 {d:"24.08.",w:"Mo",h:"Kapitel 06 – Armut",m:"",
  t:["Lernpfad: Kapitel 06 komplett","Boss-Check Kapitel 06","Training: fällige Karten","Singer, Narveson, Rawls, Pogge in je einem Satz"]},
 {d:"25.08.",w:"Di",h:"Kapitel 07 – Umweltethik",m:"",
  t:["Lernpfad: Kapitel 07 komplett","Boss-Check Kapitel 07","Training: fällige Karten","Die vier Grundpositionen nach Reichweite ordnen"]},
 {d:"26.08.",w:"Mi",h:"Kapitel 08 – Klimaethik",m:"Alle VL-Kapitel einmal durch",
  t:["Lernpfad: Kapitel 08 komplett","Boss-Check Kapitel 08","Training: fällige Karten","VUP vs. NP mit je zwei Kritikpunkten"]},
 {d:"27.08.",w:"Do",h:"Gastvortrag KI-Ethik + Roter Faden",m:"",
  t:["Lernpfad: Gastvortrag komplett","Boss-Check Gastvortrag","Roter Faden: alle sieben Verbindungen einmal durchgehen","Training: Verbindungsfragen"]},
 {d:"28.08.",w:"Fr",h:"Probeklausur",m:"Probeklausur unter Zeit",
  t:["Training: 30 Fragen gemischt, Begründung jedes Mal SCHRIFTLICH","Ehrlich selbst bewerten","Die drei schwächsten Kapitel notieren"]},
 {d:"29.08.",w:"Sa",h:"Gezielte Fehlerarbeit",m:"",
  t:["Training: Modus „Nur Fehler“ leeren","Schwächste zwei Kapitel im Nachschlagewerk lesen","Alle Merksätze durchgehen"]},
 {d:"30.08.",w:"So",h:"Lockerer Durchgang, früh Schluss",m:"Morgen ist es so weit",
  t:["Nur Roter Faden und Merksätze überfliegen","Ein gemischter Durchgang, max. 20 Minuten","Fremdwörterbuch einpacken, früh schlafen"]},
];
