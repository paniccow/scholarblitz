export const historyQuestions = [
  // ===== ANCIENT HISTORY =====

  // Mesopotamia
  { category: 'History', question_text: 'This ancient Sumerian city-state, located in modern-day Iraq, is often considered the world\'s first true city. Its ziggurat was dedicated to the moon god Nanna. Name this birthplace of writing and urbanization.', answer: 'Ur', answer_aliases: ['City of Ur'], difficulty: 3 },
  { category: 'History', question_text: 'This Babylonian king is best known for a code of laws inscribed on a black diorite stele, one of the oldest deciphered writings of significant length. The code contains 282 laws with scaled punishments. Name this ruler.', answer: 'Hammurabi', answer_aliases: ['Hammurapi'], difficulty: 2 },
  { category: 'History', question_text: 'This Akkadian ruler is often regarded as the first empire builder in history. He conquered the Sumerian city-states around 2334 BC and established an empire stretching from the Persian Gulf to the Mediterranean. Name this king.', answer: 'Sargon of Akkad', answer_aliases: ['Sargon the Great', 'Sargon'], difficulty: 3 },
  { category: 'History', question_text: 'This Neo-Babylonian king constructed the Hanging Gardens and destroyed Solomon\'s Temple in Jerusalem in 586 BC. He defeated Egypt at the Battle of Carchemish. Name this ruler of the Chaldean dynasty.', answer: 'Nebuchadnezzar II', answer_aliases: ['Nebuchadnezzar', 'Nebuchadrezzar II'], difficulty: 3 },
  { category: 'History', question_text: 'This writing system, characterized by wedge-shaped marks on clay tablets, was developed by the Sumerians around 3400 BC and became the standard script of Mesopotamian civilizations. Name this writing system.', answer: 'Cuneiform', answer_aliases: [], difficulty: 2 },

  // Egypt
  { category: 'History', question_text: 'This female pharaoh of the Eighteenth Dynasty is known for her prosperous reign and ambitious building projects, including her mortuary temple at Deir el-Bahari. She was one of the most successful pharaohs. Name this ruler.', answer: 'Hatshepsut', answer_aliases: [], difficulty: 3 },
  { category: 'History', question_text: 'This pharaoh of the Eighteenth Dynasty is famous for briefly converting Egypt to monotheistic worship of the Aten, the sun disk. He moved the capital to a new city called Akhetaten. Name this ruler, originally called Amenhotep IV.', answer: 'Akhenaten', answer_aliases: ['Amenhotep IV', 'Ikhnaton'], difficulty: 3 },
  { category: 'History', question_text: 'Discovered in 1799 by French soldiers in Egypt, this artifact featured the same text in three scripts and proved crucial to Jean-Francois Champollion\'s decipherment of Egyptian hieroglyphics in 1822. Name this stone.', answer: 'Rosetta Stone', answer_aliases: ['The Rosetta Stone'], difficulty: 1 },
  { category: 'History', question_text: 'This battle of 1274 BC between the forces of Ramesses II and the Hittite king Muwatalli II is one of the earliest recorded battles in history and led to history\'s first known peace treaty. Name this clash fought in modern-day Syria.', answer: 'Battle of Kadesh', answer_aliases: ['Kadesh', 'Battle of Qadesh'], difficulty: 4 },
  { category: 'History', question_text: 'This British archaeologist discovered the nearly intact tomb of Tutankhamun in the Valley of the Kings in November 1922, calling it "wonderful things" when he peered inside. Name this Egyptologist.', answer: 'Howard Carter', answer_aliases: ['Carter'], difficulty: 2 },

  // Greece
  { category: 'History', question_text: 'At this 480 BC naval battle near Athens, the Greek fleet under Themistocles decisively defeated the larger Persian navy of Xerxes I by luring them into a narrow strait. Name this engagement.', answer: 'Battle of Salamis', answer_aliases: ['Salamis'], difficulty: 2 },
  { category: 'History', question_text: 'This Athenian statesman oversaw the construction of the Parthenon and led Athens during its Golden Age in the 5th century BC. The period of his dominance is often called his namesake "Age." Name this leader.', answer: 'Pericles', answer_aliases: [], difficulty: 2 },
  { category: 'History', question_text: 'This conflict between Athens and Sparta, chronicled by Thucydides, lasted from 431 to 404 BC and ended with Spartan victory and the dismantling of the Athenian empire. Name this war.', answer: 'Peloponnesian War', answer_aliases: ['The Peloponnesian War'], difficulty: 2 },
  { category: 'History', question_text: 'At this 490 BC battle, a heavily outnumbered Athenian force under Miltiades defeated the invading Persian army on a coastal plain northeast of Athens. A legendary messenger ran to Athens to announce the victory. Name this battle.', answer: 'Battle of Marathon', answer_aliases: ['Marathon'], difficulty: 2 },
  { category: 'History', question_text: 'This 480 BC battle saw 300 Spartans under King Leonidas make a famous last stand against the Persian army of Xerxes at a narrow coastal pass. Name this engagement.', answer: 'Battle of Thermopylae', answer_aliases: ['Thermopylae'], difficulty: 2 },

  // Rome
  { category: 'History', question_text: 'This series of three conflicts between Rome and Carthage, fought from 264 to 146 BC, ended with the complete destruction of Carthage. The second of these wars featured Hannibal\'s crossing of the Alps. Name these wars.', answer: 'Punic Wars', answer_aliases: ['The Punic Wars'], difficulty: 2 },
  { category: 'History', question_text: 'This first Roman emperor, born Gaius Octavius, established the Principate and ushered in the Pax Romana. He defeated Mark Antony at the Battle of Actium in 31 BC. Name this ruler.', answer: 'Augustus', answer_aliases: ['Caesar Augustus', 'Octavian', 'Augustus Caesar'], difficulty: 2 },
  { category: 'History', question_text: 'In 73 BC, this Thracian gladiator led a massive slave revolt against Rome, defeating several Roman legions before being crushed by Marcus Licinius Crassus in 71 BC. Name this rebel leader.', answer: 'Spartacus', answer_aliases: [], difficulty: 2 },
  { category: 'History', question_text: 'This Roman emperor issued the Edict of Milan in 313 AD, granting tolerance to Christianity, and moved the capital to Byzantium, which he renamed Constantinople. Name this emperor.', answer: 'Constantine the Great', answer_aliases: ['Constantine', 'Constantine I'], difficulty: 2 },
  { category: 'History', question_text: 'This 9 AD battle in the Teutoburg Forest saw Germanic tribes under Arminius annihilate three Roman legions commanded by Publius Quinctilius Varus, halting Roman expansion into Germania. Name this battle.', answer: 'Battle of the Teutoburg Forest', answer_aliases: ['Teutoburg Forest', 'Battle of Teutoburger Wald', 'Varian Disaster'], difficulty: 4 },

  // Ancient China
  { category: 'History', question_text: 'This first emperor of a unified China standardized weights, measures, and writing. He is also known for the massive terracotta army buried near his tomb in Xi\'an. Name this ruler who founded the Qin dynasty.', answer: 'Qin Shi Huang', answer_aliases: ['Qin Shi Huangdi', 'Shi Huangdi', 'Ying Zheng'], difficulty: 2 },
  { category: 'History', question_text: 'This Chinese philosopher, born Kong Qiu around 551 BC, developed a system of ethics and social philosophy emphasizing filial piety, ritual propriety, and virtuous governance that shaped East Asian civilization. Name this thinker.', answer: 'Confucius', answer_aliases: ['Kong Qiu', 'Kongzi', 'Master Kong'], difficulty: 1 },

  // Ancient India
  { category: 'History', question_text: 'This Maurya emperor, after witnessing the devastation of his conquest of Kalinga around 261 BC, converted to Buddhism and spread its teachings through rock and pillar edicts across the Indian subcontinent. Name this ruler.', answer: 'Ashoka', answer_aliases: ['Ashoka the Great', 'Emperor Ashoka'], difficulty: 2 },

  // Ancient Persia
  { category: 'History', question_text: 'This founder of the Achaemenid Empire conquered the Medes, Lydians, and Babylonians to create the largest empire the world had yet seen. He is known for his policy of religious tolerance and is praised in the Hebrew Bible. Name this king.', answer: 'Cyrus the Great', answer_aliases: ['Cyrus II', 'Cyrus'], difficulty: 2 },
  { category: 'History', question_text: 'This multilingual rock inscription, carved on a cliff in western Iran by order of Darius I around 520 BC, was crucial in deciphering cuneiform script, similar to the Rosetta Stone\'s role for hieroglyphics. Name this inscription.', answer: 'Behistun Inscription', answer_aliases: ['Bisotun Inscription', 'Behistun'], difficulty: 5 },

  // ===== MEDIEVAL HISTORY =====

  // Byzantine Empire
  { category: 'History', question_text: 'This Byzantine emperor, who ruled from 527 to 565, reconquered much of the former Western Roman Empire and commissioned the codification of Roman law known as the Corpus Juris Civilis. Name this ruler.', answer: 'Justinian I', answer_aliases: ['Justinian', 'Justinian the Great'], difficulty: 2 },
  { category: 'History', question_text: 'This 1453 event saw Ottoman forces under Mehmed II breach the Theodosian Walls using massive cannons, ending over a thousand years of Roman imperial continuity. Name this siege.', answer: 'Fall of Constantinople', answer_aliases: ['Siege of Constantinople', 'Conquest of Constantinople'], difficulty: 2 },

  // Islamic Golden Age
  { category: 'History', question_text: 'This Abbasid-era scholar, known as the "Father of Algebra," wrote "Al-Kitab al-Mukhtasar fi Hisab al-Jabr wal-Muqabala," from which the word "algebra" derives. Name this Persian mathematician.', answer: 'Al-Khwarizmi', answer_aliases: ['Muhammad ibn Musa al-Khwarizmi', 'Khwarizmi'], difficulty: 3 },
  { category: 'History', question_text: 'This 14th-century Arab scholar wrote the "Muqaddimah," considered a foundational work of historiography, sociology, and economics. He theorized about the cyclical rise and fall of civilizations. Name this North African polymath.', answer: 'Ibn Khaldun', answer_aliases: ['Ibn Khaldoun'], difficulty: 3 },

  // Feudal Europe
  { category: 'History', question_text: 'This 1066 battle saw William, Duke of Normandy, defeat King Harold II of England, with Harold reportedly killed by an arrow to the eye. It led to the Norman conquest of England. Name this battle.', answer: 'Battle of Hastings', answer_aliases: ['Hastings'], difficulty: 1 },
  { category: 'History', question_text: 'This pandemic, peaking in Europe from 1347 to 1351, killed an estimated one-third to one-half of Europe\'s population. It was caused by the bacterium Yersinia pestis spread by fleas on rats. Name this catastrophe.', answer: 'Black Death', answer_aliases: ['Black Plague', 'Bubonic Plague', 'The Plague'], difficulty: 1 },
  { category: 'History', question_text: 'This 1215 document, forced upon King John of England by rebel barons at Runnymede, established the principle that the king was not above the law. It later influenced constitutional law worldwide. Name this charter.', answer: 'Magna Carta', answer_aliases: ['The Great Charter'], difficulty: 1 },

  // Mongol Empire
  { category: 'History', question_text: 'Born Temujin around 1162, this leader united the Mongol tribes and built the largest contiguous land empire in history, stretching from Korea to Eastern Europe. Name this conqueror.', answer: 'Genghis Khan', answer_aliases: ['Chinggis Khan', 'Temujin'], difficulty: 1 },
  { category: 'History', question_text: 'This grandson of Genghis Khan established the Yuan dynasty in China and was the subject of a famous account by the Venetian traveler Marco Polo. Name this Mongol emperor.', answer: 'Kublai Khan', answer_aliases: ['Kubilai Khan'], difficulty: 2 },

  // Crusades
  { category: 'History', question_text: 'This Muslim sultan recaptured Jerusalem in 1187 after the Battle of Hattin, prompting the Third Crusade. He was known for his chivalry and was respected even by his European opponents. Name this Ayyubid ruler.', answer: 'Saladin', answer_aliases: ['Salah ad-Din', 'Salah al-Din Yusuf ibn Ayyub'], difficulty: 2 },
  { category: 'History', question_text: 'This 1204 event saw Crusaders sack a Christian city instead of their intended Muslim targets, establishing a short-lived Latin Empire. It permanently weakened the Byzantine Empire. Name this infamous diversion of the Fourth Crusade.', answer: 'Sack of Constantinople', answer_aliases: ['Fourth Crusade sack of Constantinople', 'Siege of Constantinople 1204'], difficulty: 3 },

  // ===== EARLY MODERN HISTORY =====

  // Renaissance
  { category: 'History', question_text: 'This powerful Florentine banking family, including Lorenzo "the Magnificent," were among the most important patrons of the Italian Renaissance. They later produced four popes. Name this dynasty.', answer: 'Medici', answer_aliases: ['The Medici', 'Medici family', 'House of Medici'], difficulty: 2 },
  { category: 'History', question_text: 'This 1454 invention by a German goldsmith from Mainz revolutionized the production of books and is considered one of the most important inventions in human history. Name this device and its inventor.', answer: 'Gutenberg printing press', answer_aliases: ['Printing press', 'Gutenberg press', 'Movable type printing press'], difficulty: 1 },

  // Reformation
  { category: 'History', question_text: 'In 1517, this German theologian is traditionally said to have nailed his Ninety-five Theses to the door of the Castle Church in Wittenberg, criticizing the sale of indulgences. Name this father of the Protestant Reformation.', answer: 'Martin Luther', answer_aliases: ['Luther'], difficulty: 1 },
  { category: 'History', question_text: 'This 1648 treaty ended both the Thirty Years\' War and the Eighty Years\' War, establishing the principle of state sovereignty in international law and reshaping the political map of Europe. Name this peace.', answer: 'Peace of Westphalia', answer_aliases: ['Treaty of Westphalia', 'Westphalia', 'Treaties of Westphalia'], difficulty: 3 },

  // Age of Exploration
  { category: 'History', question_text: 'This Portuguese explorer\'s expedition was the first to circumnavigate the globe, though he himself was killed in the Philippines in 1521. Name this navigator.', answer: 'Ferdinand Magellan', answer_aliases: ['Magellan', 'Fernao de Magalhaes'], difficulty: 1 },
  { category: 'History', question_text: 'This 1494 agreement between Spain and Portugal, mediated by Pope Alexander VI, divided the newly discovered lands outside Europe between the two kingdoms along a meridian west of the Cape Verde islands. Name this treaty.', answer: 'Treaty of Tordesillas', answer_aliases: ['Tordesillas'], difficulty: 3 },

  // Enlightenment
  { category: 'History', question_text: 'This French philosopher argued for the separation of governmental powers into legislative, executive, and judicial branches in his work "The Spirit of the Laws." Name this Enlightenment thinker.', answer: 'Montesquieu', answer_aliases: ['Baron de Montesquieu', 'Charles de Secondat'], difficulty: 2 },
  { category: 'History', question_text: 'This English philosopher\'s "Two Treatises of Government" argued that people have natural rights to life, liberty, and property, and that government derives its authority from the consent of the governed. Name this thinker.', answer: 'John Locke', answer_aliases: ['Locke'], difficulty: 2 },

  // ===== AMERICAN HISTORY =====

  // Colonial & Revolution
  { category: 'History', question_text: 'This 1773 protest saw American colonists, disguised as Mohawk Indians, dump 342 chests of tea into the harbor to protest the Tea Act and taxation without representation. Name this event.', answer: 'Boston Tea Party', answer_aliases: ['The Boston Tea Party'], difficulty: 1 },
  { category: 'History', question_text: 'This 1781 siege in Virginia, where George Washington and French forces under Rochambeau trapped British General Cornwallis, effectively ended major combat in the American Revolution. Name this battle.', answer: 'Battle of Yorktown', answer_aliases: ['Yorktown', 'Siege of Yorktown'], difficulty: 2 },
  { category: 'History', question_text: 'This 1777 American victory in upstate New York is considered the turning point of the Revolutionary War because it convinced France to enter the war as an American ally. Name this battle.', answer: 'Battle of Saratoga', answer_aliases: ['Saratoga', 'Battles of Saratoga'], difficulty: 2 },

  // Civil War & Reconstruction
  { category: 'History', question_text: 'This July 1863 battle in Pennsylvania was the bloodiest of the Civil War and is considered its turning point. Pickett\'s Charge on the third day ended in a devastating Confederate defeat. Name this engagement.', answer: 'Battle of Gettysburg', answer_aliases: ['Gettysburg'], difficulty: 1 },
  { category: 'History', question_text: 'This Union general\'s "March to the Sea" from Atlanta to Savannah in late 1864 devastated Confederate infrastructure and civilian resources, pioneering the concept of total war. Name this commander.', answer: 'William Tecumseh Sherman', answer_aliases: ['Sherman', 'General Sherman'], difficulty: 2 },
  { category: 'History', question_text: 'These three amendments to the U.S. Constitution, ratified between 1865 and 1870, abolished slavery, granted citizenship and equal protection, and prohibited denying the vote based on race. Name this group of amendments by their collective title.', answer: 'Reconstruction Amendments', answer_aliases: ['Civil War Amendments', '13th 14th and 15th Amendments'], difficulty: 3 },

  // Civil Rights
  { category: 'History', question_text: 'In 1955, this woman\'s refusal to give up her bus seat to a white passenger in Montgomery, Alabama, sparked a 381-day bus boycott that became a landmark of the civil rights movement. Name this activist.', answer: 'Rosa Parks', answer_aliases: ['Parks'], difficulty: 1 },
  { category: 'History', question_text: 'This 1954 Supreme Court case unanimously ruled that racial segregation in public schools was unconstitutional, overturning the "separate but equal" doctrine of Plessy v. Ferguson. Name this landmark case.', answer: 'Brown v. Board of Education', answer_aliases: ['Brown v. Board', 'Brown versus Board of Education'], difficulty: 1 },
  { category: 'History', question_text: 'This 1965 act, signed by President Lyndon Johnson, prohibited racial discrimination in voting by outlawing literacy tests and other barriers that had disenfranchised African Americans, particularly in the South. Name this legislation.', answer: 'Voting Rights Act', answer_aliases: ['Voting Rights Act of 1965'], difficulty: 2 },

  // Cold War America
  { category: 'History', question_text: 'This October 1962 confrontation between the United States and Soviet Union over nuclear missiles placed on a Caribbean island brought the world closer to nuclear war than any other event. Name this crisis.', answer: 'Cuban Missile Crisis', answer_aliases: ['October Crisis', 'Caribbean Crisis'], difficulty: 1 },
  { category: 'History', question_text: 'This U.S. foreign policy, announced in 1947, pledged American support for nations threatened by Soviet communism. It was first applied to Greece and Turkey. Name this doctrine.', answer: 'Truman Doctrine', answer_aliases: [], difficulty: 2 },
  { category: 'History', question_text: 'This 1948-1949 operation saw American and British aircraft fly over 200,000 missions to supply West Berlin after the Soviet Union blocked all ground access to the city. Name this airlift.', answer: 'Berlin Airlift', answer_aliases: ['Berlin Blockade airlift', 'Operation Vittles'], difficulty: 2 },

  // ===== WORLD WARS =====

  // World War I
  { category: 'History', question_text: 'This June 28, 1914 assassination of an Austro-Hungarian heir by Gavrilo Princip in Sarajevo is widely considered the immediate trigger for World War I. Name the person who was assassinated.', answer: 'Archduke Franz Ferdinand', answer_aliases: ['Franz Ferdinand'], difficulty: 1 },
  { category: 'History', question_text: 'This 1916 battle along a French river saw nearly 300 days of fighting between German and French forces, with combined casualties exceeding 700,000. The French rallying cry was "They shall not pass." Name this battle.', answer: 'Battle of Verdun', answer_aliases: ['Verdun'], difficulty: 2 },
  { category: 'History', question_text: 'This 1919 treaty officially ended World War I. It imposed harsh reparations on Germany, redrew European borders, and established the League of Nations. Name this agreement.', answer: 'Treaty of Versailles', answer_aliases: ['Versailles Treaty', 'Versailles'], difficulty: 1 },
  { category: 'History', question_text: 'This 1917 secret communication from Germany to Mexico, proposing a military alliance against the United States, was intercepted by British intelligence and helped push America into World War I. Name this telegram.', answer: 'Zimmermann Telegram', answer_aliases: ['Zimmermann Note', 'Zimmerman Telegram'], difficulty: 2 },
  { category: 'History', question_text: 'This 1916 battle along a river in northern France was one of the bloodiest in human history, with over one million casualties. The British used tanks in combat for the first time. Name this battle.', answer: 'Battle of the Somme', answer_aliases: ['The Somme', 'Somme'], difficulty: 2 },

  // World War II
  { category: 'History', question_text: 'This June 6, 1944 Allied invasion of Nazi-occupied France, codenamed Operation Overlord, was the largest amphibious military operation in history. Name this day.', answer: 'D-Day', answer_aliases: ['Normandy landings', 'Normandy invasion', 'Operation Overlord'], difficulty: 1 },
  { category: 'History', question_text: 'This 1942-1943 battle is considered the turning point of the Eastern Front. Soviet forces encircled and destroyed the German 6th Army under Friedrich Paulus. Name this battle fought over a Soviet city on the Volga.', answer: 'Battle of Stalingrad', answer_aliases: ['Stalingrad'], difficulty: 1 },
  { category: 'History', question_text: 'This 1944-1945 German offensive through the densely forested Ardennes region of Belgium was Hitler\'s last major attack on the Western Front. Allied forces eventually repelled it despite initial surprise. Name this battle.', answer: 'Battle of the Bulge', answer_aliases: ['Ardennes Offensive', 'Ardennes Counteroffensive'], difficulty: 2 },
  { category: 'History', question_text: 'This 1942 naval battle near a Pacific atoll saw the U.S. Navy sink four Japanese aircraft carriers, turning the tide of the Pacific War. American codebreakers played a crucial role. Name this battle.', answer: 'Battle of Midway', answer_aliases: ['Midway'], difficulty: 2 },
  { category: 'History', question_text: 'This Nazi conference in January 1942, held in a Berlin suburb, coordinated the implementation of the "Final Solution to the Jewish Question," the systematic genocide of European Jews. Name this conference.', answer: 'Wannsee Conference', answer_aliases: ['Wannsee'], difficulty: 4 },
  { category: 'History', question_text: 'This series of trials held from 1945 to 1946 prosecuted major Nazi leaders for war crimes, crimes against humanity, and crimes against peace. It established key precedents in international law. Name these trials held in a German city.', answer: 'Nuremberg Trials', answer_aliases: ['Nuremberg Trial', 'Nuremberg'], difficulty: 1 },

  // ===== ASIAN HISTORY =====

  // China
  { category: 'History', question_text: 'This 1839-1842 conflict began when China attempted to suppress the British opium trade. China\'s defeat led to the Treaty of Nanking, which ceded Hong Kong to Britain. Name this war.', answer: 'First Opium War', answer_aliases: ['Opium War', 'Anglo-Chinese War'], difficulty: 2 },
  { category: 'History', question_text: 'This 1850-1864 rebellion, led by Hong Xiuquan who claimed to be the brother of Jesus Christ, was one of the deadliest conflicts in history with an estimated 20-30 million casualties. Name this Chinese civil war.', answer: 'Taiping Rebellion', answer_aliases: ['Taiping Civil War', 'Taiping Revolution'], difficulty: 3 },
  { category: 'History', question_text: 'This 1934-1935 military retreat by the Chinese Communist Red Army, covering approximately 6,000 miles to evade Nationalist forces, solidified Mao Zedong\'s leadership of the Communist Party. Name this trek.', answer: 'Long March', answer_aliases: ['The Long March'], difficulty: 2 },

  // Japan
  { category: 'History', question_text: 'This period of Japanese history from 1603 to 1868 was characterized by a policy of national isolation called sakoku and rule by shoguns from a powerful clan based in Edo. Name this shogunate.', answer: 'Tokugawa Shogunate', answer_aliases: ['Tokugawa', 'Edo period', 'Tokugawa period'], difficulty: 2 },
  { category: 'History', question_text: 'This 1868 event restored imperial rule to Japan under Emperor Mutsuhito and launched a rapid program of modernization and industrialization. Name this transformation.', answer: 'Meiji Restoration', answer_aliases: ['Meiji Revolution', 'Meiji'], difficulty: 2 },
  { category: 'History', question_text: 'This 1905 treaty, mediated by U.S. President Theodore Roosevelt in New Hampshire, ended the Russo-Japanese War and marked the first time a modern Asian power defeated a European nation. Name this agreement.', answer: 'Treaty of Portsmouth', answer_aliases: ['Portsmouth Treaty'], difficulty: 3 },

  // Mughal Empire
  { category: 'History', question_text: 'This Mughal emperor, who ruled from 1556 to 1605, is known for his policy of religious tolerance and the creation of Din-i Ilahi, a syncretic religion blending elements of Islam, Hinduism, and other faiths. Name this ruler.', answer: 'Akbar', answer_aliases: ['Akbar the Great', 'Jalal-ud-din Muhammad Akbar'], difficulty: 2 },
  { category: 'History', question_text: 'This Mughal emperor commissioned a white marble mausoleum in Agra as a memorial for his wife Mumtaz Mahal, creating one of the most famous buildings in the world. Name this ruler.', answer: 'Shah Jahan', answer_aliases: ['Shah Jahan I'], difficulty: 2 },

  // Korean War & Vietnam War
  { category: 'History', question_text: 'This September 1950 amphibious landing behind North Korean lines, masterminded by General Douglas MacArthur, turned the tide of the Korean War and led to the recapture of Seoul. Name this operation.', answer: 'Battle of Inchon', answer_aliases: ['Inchon Landing', 'Battle of Incheon'], difficulty: 3 },
  { category: 'History', question_text: 'This 1968 surprise offensive by North Vietnamese and Viet Cong forces during a holiday ceasefire shocked the American public and turned opinion against the Vietnam War, despite being a military defeat for the attackers. Name this offensive.', answer: 'Tet Offensive', answer_aliases: ['Tet'], difficulty: 2 },
  { category: 'History', question_text: 'This 1954 battle saw Vietnamese forces under General Vo Nguyen Giap besiege and defeat French colonial troops in a valley in northwestern Vietnam, effectively ending French Indochina. Name this decisive engagement.', answer: 'Battle of Dien Bien Phu', answer_aliases: ['Dien Bien Phu'], difficulty: 3 },

  // ===== AFRICAN HISTORY =====

  // Mali Empire
  { category: 'History', question_text: 'This 14th-century Malian emperor made a famous pilgrimage to Mecca in 1324, distributing so much gold along the way that he crashed the gold market in Cairo and Medina. He is often called the wealthiest person in history. Name this ruler.', answer: 'Mansa Musa', answer_aliases: ['Musa I', 'Musa I of Mali'], difficulty: 1 },
  { category: 'History', question_text: 'This West African city, part of the Mali and later Songhai empires, was a renowned center of Islamic learning. Its university, Sankore, housed hundreds of thousands of manuscripts. Name this city in modern-day Mali.', answer: 'Timbuktu', answer_aliases: ['Tombouctou'], difficulty: 2 },

  // Zulu Kingdom
  { category: 'History', question_text: 'This Zulu king, who ruled from about 1816 to 1828, revolutionized warfare in southern Africa by introducing the short stabbing spear called the iklwa and the "horns of the buffalo" formation. Name this military innovator.', answer: 'Shaka Zulu', answer_aliases: ['Shaka', 'Shaka kaSenzangakhona'], difficulty: 2 },
  { category: 'History', question_text: 'At this January 1879 battle during the Anglo-Zulu War, a Zulu force of approximately 20,000 overwhelmed and destroyed a British column of 1,800 troops, one of the worst defeats in British colonial history. Name this battle.', answer: 'Battle of Isandlwana', answer_aliases: ['Isandlwana'], difficulty: 4 },

  // Colonialism and Independence
  { category: 'History', question_text: 'This 1884-1885 conference, organized by Otto von Bismarck in a European capital, set the rules for European colonization and trade in Africa, effectively partitioning the continent. No African leaders were invited. Name this conference.', answer: 'Berlin Conference', answer_aliases: ['Berlin West Africa Conference', 'Congo Conference'], difficulty: 2 },
  { category: 'History', question_text: 'This leader of the Ghanaian independence movement became the first prime minister and president of Ghana in 1957, making it the first sub-Saharan African country to gain independence from European colonial rule. Name this Pan-Africanist.', answer: 'Kwame Nkrumah', answer_aliases: ['Nkrumah'], difficulty: 3 },
  { category: 'History', question_text: 'This South African leader spent 27 years in prison before becoming the country\'s first Black president in 1994 and overseeing the transition from apartheid. Name this Nobel Peace Prize laureate.', answer: 'Nelson Mandela', answer_aliases: ['Mandela'], difficulty: 1 },

  // ===== LATIN AMERICAN HISTORY =====

  // Pre-Columbian
  { category: 'History', question_text: 'This Aztec capital, built on an island in Lake Texcoco, had a population of over 200,000 when Hernan Cortes arrived in 1519, making it one of the largest cities in the world at the time. Name this city.', answer: 'Tenochtitlan', answer_aliases: ['Tenochtitlan'], difficulty: 2 },
  { category: 'History', question_text: 'This Incan citadel, built in the 15th century and located nearly 8,000 feet above sea level in the Andes, was brought to international attention by Hiram Bingham in 1911. Name this archaeological site in Peru.', answer: 'Machu Picchu', answer_aliases: [], difficulty: 1 },
  { category: 'History', question_text: 'This last Aztec emperor was captured by Hernan Cortes in 1520. His name means "Angry Lord" or "He Who Descends Like an Eagle." Name this ruler.', answer: 'Montezuma II', answer_aliases: ['Moctezuma II', 'Montezuma', 'Moctezuma'], difficulty: 2 },

  // Liberation Movements
  { category: 'History', question_text: 'This Venezuelan-born military leader liberated much of South America from Spanish rule, earning the title "The Liberator." He freed Venezuela, Colombia, Ecuador, Peru, and Bolivia. Name this figure.', answer: 'Simon Bolivar', answer_aliases: ['Bolivar', 'El Libertador'], difficulty: 1 },
  { category: 'History', question_text: 'This Argentine general crossed the Andes with his army to liberate Chile and Peru from Spanish rule, and is regarded as one of the primary heroes of South American independence alongside Bolivar. Name this leader.', answer: 'Jose de San Martin', answer_aliases: ['San Martin'], difficulty: 3 },
  { category: 'History', question_text: 'This 1791 slave revolt in a French Caribbean colony, led by Toussaint Louverture, eventually resulted in the establishment of the first independent Black republic in 1804. Name this revolution.', answer: 'Haitian Revolution', answer_aliases: ['Saint-Domingue Revolution'], difficulty: 2 },

  // Cuban Revolution
  { category: 'History', question_text: 'This 1959 revolution overthrew the Batista dictatorship and brought Fidel Castro to power. It was supported by guerrilla fighters including the Argentine revolutionary Che Guevara. Name this revolution.', answer: 'Cuban Revolution', answer_aliases: [], difficulty: 1 },
  { category: 'History', question_text: 'This April 1961 failed CIA-backed invasion of Cuba by Cuban exiles aimed to overthrow Fidel Castro but was crushed within three days, embarrassing the Kennedy administration. Name this invasion.', answer: 'Bay of Pigs Invasion', answer_aliases: ['Bay of Pigs', 'Playa Giron'], difficulty: 2 },

  // ===== MODERN HISTORY =====

  // Cold War
  { category: 'History', question_text: 'This U.S.-funded program, announced by Secretary of State George Marshall in 1947, provided over $13 billion in economic aid to help rebuild Western European economies after World War II. Name this plan.', answer: 'Marshall Plan', answer_aliases: ['European Recovery Program'], difficulty: 1 },
  { category: 'History', question_text: 'This Soviet-led military alliance, formed in 1955 as a counterbalance to NATO, included most Eastern Bloc nations and was dissolved in 1991. Name this pact.', answer: 'Warsaw Pact', answer_aliases: ['Warsaw Treaty Organization'], difficulty: 1 },
  { category: 'History', question_text: 'This 1962 event saw Soviet leader Nikita Khrushchev construct a barrier through a European capital overnight to prevent citizens from fleeing to the West. Name this structure that stood until 1989.', answer: 'Berlin Wall', answer_aliases: ['The Berlin Wall'], difficulty: 1 },

  // Fall of USSR
  { category: 'History', question_text: 'This Soviet leader introduced the reforms of glasnost (openness) and perestroika (restructuring) in the 1980s, which inadvertently hastened the dissolution of the Soviet Union. Name this last Soviet leader.', answer: 'Mikhail Gorbachev', answer_aliases: ['Gorbachev'], difficulty: 1 },
  { category: 'History', question_text: 'This December 1991 agreement between Russia, Ukraine, and Belarus formally dissolved the Soviet Union and established the Commonwealth of Independent States. Name this accord, signed in a Belarusian forest.', answer: 'Belavezha Accords', answer_aliases: ['Belovezhskaya Pushcha Agreement', 'Belovezh Accords'], difficulty: 5 },

  // European Union
  { category: 'History', question_text: 'This 1992 treaty, signed in a Dutch city, established the European Union, created European citizenship, and laid the groundwork for a common currency. Name this foundational EU treaty.', answer: 'Maastricht Treaty', answer_aliases: ['Treaty of Maastricht', 'Treaty on European Union'], difficulty: 3 },

  // Middle East
  { category: 'History', question_text: 'This 1967 war saw Israel capture the Sinai Peninsula, Gaza Strip, West Bank, Golan Heights, and East Jerusalem from its Arab neighbors in just six days. Name this conflict.', answer: 'Six-Day War', answer_aliases: ['1967 Arab-Israeli War', 'June War', 'Third Arab-Israeli War'], difficulty: 2 },
  { category: 'History', question_text: 'This 1979 revolution overthrew the Shah of Iran and established an Islamic republic under Ayatollah Ruhollah Khomeini. It led to the hostage crisis at the U.S. embassy in Tehran. Name this revolution.', answer: 'Iranian Revolution', answer_aliases: ['Islamic Revolution', 'Iranian Islamic Revolution', '1979 Revolution'], difficulty: 2 },
  { category: 'History', question_text: 'This 1978 agreement, brokered by U.S. President Jimmy Carter, established a framework for peace between Egypt and Israel. Egyptian President Sadat and Israeli Prime Minister Begin shared the Nobel Peace Prize. Name this accord.', answer: 'Camp David Accords', answer_aliases: ['Camp David Agreement', 'Camp David'], difficulty: 2 },

  // Economic History
  { category: 'History', question_text: 'This 1637 economic bubble in the Dutch Republic saw the price of certain flower bulbs reach extraordinarily high levels before dramatically collapsing. It is often cited as the first recorded speculative bubble. Name this mania.', answer: 'Tulip Mania', answer_aliases: ['Tulipmania', 'Tulip Bubble', 'Tulip craze'], difficulty: 3 },
  { category: 'History', question_text: 'This October 29, 1929 stock market crash, known by its day of the week, triggered the Great Depression and wiped out millions of investors. Name this infamous day.', answer: 'Black Tuesday', answer_aliases: ['Stock Market Crash of 1929'], difficulty: 2 },
  { category: 'History', question_text: 'This economic program, introduced by Franklin D. Roosevelt beginning in 1933, included agencies like the CCC, WPA, and TVA to combat the Great Depression through government spending and reform. Name this set of programs.', answer: 'New Deal', answer_aliases: ['The New Deal'], difficulty: 1 },

  // Historical Documents
  { category: 'History', question_text: 'This 1648 document, signed at the end of the English Civil War period, was presented to King Charles I, demanding parliamentary supremacy and religious liberty. It was debated by members of the New Model Army at Putney. Name this constitutional proposal.', answer: 'Agreement of the People', answer_aliases: ['An Agreement of the People'], difficulty: 5 },
  { category: 'History', question_text: 'This 1689 English law established parliamentary sovereignty, free elections, and freedom of speech in Parliament. It also barred Roman Catholics from the throne. Name this foundational constitutional document.', answer: 'English Bill of Rights', answer_aliases: ['Bill of Rights 1689'], difficulty: 3 },
  { category: 'History', question_text: 'This 1823 U.S. foreign policy statement declared that European powers should no longer colonize or interfere with states in the Americas. Name this doctrine.', answer: 'Monroe Doctrine', answer_aliases: ['The Monroe Doctrine'], difficulty: 2 },

  // Archaeological Discoveries
  { category: 'History', question_text: 'This German archaeologist, following clues in Homer\'s Iliad, excavated the site of Hisarlik in Turkey in the 1870s, claiming to have found the ancient city of Troy and its legendary treasure. Name this excavator.', answer: 'Heinrich Schliemann', answer_aliases: ['Schliemann'], difficulty: 3 },
  { category: 'History', question_text: 'This 1947 discovery by a Bedouin shepherd in caves near the Dead Sea yielded ancient Jewish manuscripts dating from the 3rd century BC to the 1st century AD, including the oldest known copies of Hebrew Bible texts. Name these manuscripts.', answer: 'Dead Sea Scrolls', answer_aliases: ['Qumran Scrolls'], difficulty: 2 },
  { category: 'History', question_text: 'This ancient Roman city near Naples was buried under volcanic ash when Mount Vesuvius erupted in 79 AD. Its remarkably preserved ruins were rediscovered in the 18th century. Name this city.', answer: 'Pompeii', answer_aliases: [], difficulty: 1 },

  // Political Movements & Revolutions
  { category: 'History', question_text: 'This 1789 event, in which a Parisian mob stormed a medieval fortress and prison, is considered the symbolic start of the French Revolution. Its date is now France\'s national holiday. Name this event.', answer: 'Storming of the Bastille', answer_aliases: ['Fall of the Bastille', 'Bastille Day', 'The Bastille'], difficulty: 1 },
  { category: 'History', question_text: 'This 1917 revolution overthrew the Russian Provisional Government and brought the Bolsheviks under Vladimir Lenin to power, establishing the world\'s first communist state. Name this revolution.', answer: 'October Revolution', answer_aliases: ['Bolshevik Revolution', 'Russian Revolution of 1917', 'Red October'], difficulty: 2 },
  { category: 'History', question_text: 'This Indian independence leader organized nonviolent resistance campaigns including the 1930 Salt March, a 240-mile protest against British colonial salt taxes. Name this "Father of the Nation."', answer: 'Mahatma Gandhi', answer_aliases: ['Gandhi', 'Mohandas Gandhi', 'Mohandas Karamchand Gandhi'], difficulty: 1 },
  { category: 'History', question_text: 'This 1989 series of mostly peaceful protests across Eastern Europe led to the fall of communist regimes in Poland, Hungary, East Germany, Czechoslovakia, Bulgaria, and Romania in rapid succession. Name this wave of revolutions.', answer: 'Revolutions of 1989', answer_aliases: ['Fall of Communism', 'Autumn of Nations'], difficulty: 3 },

  // Additional diverse questions
  { category: 'History', question_text: 'This ancient Ethiopian kingdom, centered in modern-day Eritrea and northern Ethiopia, was one of the four great powers of the ancient world according to the Persian prophet Mani. It adopted Christianity in the 4th century AD. Name this kingdom.', answer: 'Kingdom of Aksum', answer_aliases: ['Aksum', 'Axum', 'Aksumite Empire'], difficulty: 4 },
  { category: 'History', question_text: 'This 1839 document of the Ottoman Empire, issued by Sultan Abdulmejid I, guaranteed the life and property of all subjects regardless of religion and launched the Tanzimat reform era. Name this decree.', answer: 'Edict of Gulhane', answer_aliases: ['Hatt-i Sharif of Gulhane', 'Gulhane Hatt-i Sharif', 'Tanzimat Edict'], difficulty: 5 },
  { category: 'History', question_text: 'This 1856 conflict between Britain and the Zulu-adjacent Xhosa people resulted from a teenage prophetess named Nongqawuse who convinced her people to destroy their own cattle and crops, leading to a devastating famine. Name this catastrophe.', answer: 'Xhosa cattle-killing movement', answer_aliases: ['Xhosa cattle killing', 'Nongqawuse prophecy'], difficulty: 5 },
  { category: 'History', question_text: 'This 1947 event saw the British Indian Empire divided into the independent nations of India and Pakistan, triggering one of the largest mass migrations in history and widespread communal violence. Name this event.', answer: 'Partition of India', answer_aliases: ['Indian Partition', 'Partition of British India'], difficulty: 2 },
  { category: 'History', question_text: 'This Cambodian communist regime, led by Pol Pot from 1975 to 1979, killed an estimated 1.5 to 2 million people through execution, forced labor, and famine in what became known as the Cambodian genocide. Name this regime.', answer: 'Khmer Rouge', answer_aliases: ['Communist Party of Kampuchea'], difficulty: 2 },
  { category: 'History', question_text: 'This 1994 genocide saw the mass slaughter of an estimated 500,000 to 800,000 Tutsi and moderate Hutu people over approximately 100 days in a small East African nation. Name this country where the genocide occurred.', answer: 'Rwanda', answer_aliases: ['Rwandan Genocide'], difficulty: 2 },
  { category: 'History', question_text: 'This 1853 American naval expedition, led by Commodore Matthew Perry, forced Japan to open its ports to Western trade after over two centuries of isolation under the Tokugawa shogunate. Name this event.', answer: 'Perry Expedition', answer_aliases: ['Opening of Japan', 'Perry\'s expedition to Japan', 'Black Ships'], difficulty: 3 },
  { category: 'History', question_text: 'This 1532 event saw Spanish conquistador Francisco Pizarro capture the Inca emperor Atahualpa at the city of Cajamarca, despite being vastly outnumbered. It marked the beginning of the Spanish conquest of the Inca Empire. Name this battle.', answer: 'Battle of Cajamarca', answer_aliases: ['Cajamarca', 'Capture of Atahualpa'], difficulty: 4 },
  { category: 'History', question_text: 'This 1389 battle between Serbian and Ottoman forces on a field in Kosovo became a defining event in Serbian national identity, even though the Serbs lost and fell under Ottoman control. Name this battle.', answer: 'Battle of Kosovo', answer_aliases: ['Battle of Kosovo Polje', 'Kosovo Polje'], difficulty: 4 },
  { category: 'History', question_text: 'This 1258 event saw Mongol forces under Hulagu Khan destroy the Abbasid capital, ending the Islamic Golden Age. The Tigris River is said to have run black with ink from the destroyed libraries. Name this siege.', answer: 'Siege of Baghdad', answer_aliases: ['Fall of Baghdad', 'Sack of Baghdad', 'Battle of Baghdad'], difficulty: 3 },
  { category: 'History', question_text: 'This 1905 revolution in Russia, triggered by the "Bloody Sunday" massacre of peaceful protesters, forced Tsar Nicholas II to create the Duma and issue the October Manifesto granting civil liberties. Name this revolution.', answer: 'Russian Revolution of 1905', answer_aliases: ['1905 Revolution', 'First Russian Revolution'], difficulty: 3 },
  { category: 'History', question_text: 'This Southeast Asian temple complex in Cambodia, built by King Suryavarman II in the early 12th century, is the largest religious monument in the world and a masterpiece of Khmer architecture. Name this temple.', answer: 'Angkor Wat', answer_aliases: [], difficulty: 1 },
  { category: 'History', question_text: 'This 1898 confrontation between French and British forces at a Sudanese fort on the White Nile nearly led to war between the two European powers and resulted in France\'s withdrawal from its claims in the Upper Nile. Name this incident.', answer: 'Fashoda Incident', answer_aliases: ['Fashoda Crisis'], difficulty: 5 },
  { category: 'History', question_text: 'This 1848 publication by Karl Marx and Friedrich Engels called for the working class to overthrow capitalism and predicted the inevitable triumph of communism. Name this foundational socialist text.', answer: 'The Communist Manifesto', answer_aliases: ['Communist Manifesto', 'Manifesto of the Communist Party'], difficulty: 1 },
  { category: 'History', question_text: 'This Chinese dynasty, ruling from 618 to 907 AD, is considered a golden age of Chinese civilization. It saw the development of woodblock printing, advances in poetry by Li Bai and Du Fu, and expansion along the Silk Road. Name this dynasty.', answer: 'Tang Dynasty', answer_aliases: ['Tang', 'The Tang Dynasty'], difficulty: 2 },
  { category: 'History', question_text: 'This 1863 battle along the Mississippi River gave the Union complete control of the river and split the Confederacy in two. General Grant\'s forces besieged the city for 47 days before it surrendered on July 4. Name this siege.', answer: 'Siege of Vicksburg', answer_aliases: ['Battle of Vicksburg', 'Vicksburg'], difficulty: 2 },
];
