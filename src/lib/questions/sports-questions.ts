export const sportsQuestions = [
  // Football (NFL)
  { category: 'Sports', question_text: 'This quarterback won seven Super Bowl titles, six with the New England Patriots and one with the Tampa Bay Buccaneers, before retiring in 2023. Name this player widely considered the greatest of all time.', answer: 'Tom Brady', answer_aliases: ['Brady'], difficulty: 1 },
  { category: 'Sports', question_text: 'This annual championship game of the NFL is the most-watched television event in the United States. Its halftime shows have featured performers from Michael Jackson to Shakira. Name this event.', answer: 'Super Bowl', answer_aliases: ['The Super Bowl'], difficulty: 1 },
  { category: 'Sports', question_text: 'This NFL wide receiver for the San Francisco 49ers holds career records for receptions, receiving yards, and receiving touchdowns. Name this player inducted into the Hall of Fame in 2010.', answer: 'Jerry Rice', answer_aliases: ['Rice'], difficulty: 2 },
  { category: 'Sports', question_text: 'This NFL running back for the Cleveland Browns set the single-season rushing record of 2,003 yards in 1963 and is considered one of the greatest football players ever. Name this athlete who retired at age 29.', answer: 'Jim Brown', answer_aliases: ['Brown'], difficulty: 3 },
  { category: 'Sports', question_text: 'This Kansas City Chiefs quarterback, known for his no-look passes and sidearm throws, won Super Bowl MVP in 2020 and led his team to multiple championships. Name this player.', answer: 'Patrick Mahomes', answer_aliases: ['Mahomes'], difficulty: 1 },

  // Basketball (NBA)
  { category: 'Sports', question_text: 'This NBA legend, who played for the Chicago Bulls, won six championships and five MVP awards. His "Airness" is widely regarded as the greatest basketball player of all time. Name this shooting guard.', answer: 'Michael Jordan', answer_aliases: ['Jordan', 'MJ'], difficulty: 1 },
  { category: 'Sports', question_text: 'This Los Angeles Lakers legend, who wore number 24, scored 81 points in a single game in 2006 and won five NBA championships before his tragic death in a helicopter crash in 2020. Name this player.', answer: 'Kobe Bryant', answer_aliases: ['Kobe', 'Bryant'], difficulty: 1 },
  { category: 'Sports', question_text: 'This NBA player, born in Akron, Ohio, is a four-time NBA champion and four-time MVP who played for the Cleveland Cavaliers, Miami Heat, and Los Angeles Lakers. Name this forward known as "King James."', answer: 'LeBron James', answer_aliases: ['LeBron', 'James'], difficulty: 1 },
  { category: 'Sports', question_text: 'This Golden State Warriors guard, known for his three-point shooting, revolutionized the modern NBA game and holds the record for most career three-pointers made. Name this player.', answer: 'Stephen Curry', answer_aliases: ['Steph Curry', 'Curry'], difficulty: 1 },
  { category: 'Sports', question_text: 'This seven-foot-one center dominated the NBA in the 1960s and 1970s, winning six championships with the Boston Celtics and pioneering the art of shot-blocking. He also fought for civil rights. Name this player.', answer: 'Bill Russell', answer_aliases: ['Russell'], difficulty: 3 },

  // Baseball (MLB)
  { category: 'Sports', question_text: 'This New York Yankees legend, known as "The Sultan of Swat," transformed baseball with his prolific home run hitting in the 1920s and held the career home run record until 1974. Name this player.', answer: 'Babe Ruth', answer_aliases: ['Ruth', 'The Bambino', 'Sultan of Swat'], difficulty: 1 },
  { category: 'Sports', question_text: 'This player broke Major League Baseball\'s color barrier when he debuted for the Brooklyn Dodgers on April 15, 1947. His number 42 was retired across all of MLB. Name this pioneering athlete.', answer: 'Jackie Robinson', answer_aliases: ['Robinson'], difficulty: 1 },
  { category: 'Sports', question_text: 'This Japanese two-way player for the Los Angeles Angels won the American League MVP in 2021 and 2023, excelling as both a pitcher and a hitter. Name this phenomenon.', answer: 'Shohei Ohtani', answer_aliases: ['Ohtani'], difficulty: 1 },
  { category: 'Sports', question_text: 'This ballpark, home of the Chicago Cubs since 1914, is the second-oldest active major league ballpark. Its ivy-covered outfield walls are iconic. Name this stadium.', answer: 'Wrigley Field', answer_aliases: ['Wrigley'], difficulty: 2 },

  // Soccer
  { category: 'Sports', question_text: 'This Argentine forward, who won the 2022 FIFA World Cup, has won the Ballon d\'Or a record number of times and spent most of his career at FC Barcelona. Name this player.', answer: 'Lionel Messi', answer_aliases: ['Messi', 'Leo Messi'], difficulty: 1 },
  { category: 'Sports', question_text: 'This Portuguese forward, known for his athleticism and goal-scoring ability, has won multiple Champions League titles with Manchester United and Real Madrid. Name this player.', answer: 'Cristiano Ronaldo', answer_aliases: ['Ronaldo', 'CR7'], difficulty: 1 },
  { category: 'Sports', question_text: 'This English Premier League club, based in Liverpool, has won six Champions League titles and is associated with the anthem "You\'ll Never Walk Alone." Name this football club.', answer: 'Liverpool FC', answer_aliases: ['Liverpool', 'Liverpool Football Club'], difficulty: 1 },
  { category: 'Sports', question_text: 'This country has won the FIFA World Cup a record five times, producing legends like Pele, Ronaldo, and Ronaldinho. Name this South American footballing nation.', answer: 'Brazil', answer_aliases: [], difficulty: 1 },
  { category: 'Sports', question_text: 'This trophy, awarded to the winner of the FIFA World Cup, was introduced in 1974 and replaced the Jules Rimet Trophy. It depicts two human figures holding up the Earth. Name this trophy.', answer: 'FIFA World Cup Trophy', answer_aliases: ['World Cup Trophy'], difficulty: 3 },

  // Tennis
  { category: 'Sports', question_text: 'This Swiss tennis player won 20 Grand Slam singles titles and is considered one of the most graceful players in the sport\'s history. He retired in 2022. Name this athlete.', answer: 'Roger Federer', answer_aliases: ['Federer'], difficulty: 1 },
  { category: 'Sports', question_text: 'This Serbian tennis player holds the record for the most Grand Slam men\'s singles titles with 24, including a record 10 Australian Open victories. Name this player.', answer: 'Novak Djokovic', answer_aliases: ['Djokovic', 'Nole'], difficulty: 1 },
  { category: 'Sports', question_text: 'This American tennis champion won 23 Grand Slam singles titles, the most in the Open Era for a woman, before retiring in 2022. Her sister Venus is also a champion. Name this player.', answer: 'Serena Williams', answer_aliases: ['Serena', 'Williams'], difficulty: 1 },

  // Golf
  { category: 'Sports', question_text: 'This golfer, who turned professional in 1996, has won 15 major championships and 82 PGA Tour events. He completed a career Grand Slam before age 25. Name this player.', answer: 'Tiger Woods', answer_aliases: ['Woods'], difficulty: 1 },
  { category: 'Sports', question_text: 'This prestigious golf tournament, held annually at Augusta National Golf Club in Georgia, is the first of four major championships each year. Winners receive a green jacket. Name this tournament.', answer: 'The Masters', answer_aliases: ['Masters Tournament', 'Masters', 'The Masters Tournament'], difficulty: 1 },

  // Olympic Sports
  { category: 'Sports', question_text: 'This Jamaican sprinter won the 100m and 200m gold medals at three consecutive Olympics from 2008 to 2016 and holds the world record in both events. Name this athlete nicknamed "Lightning Bolt."', answer: 'Usain Bolt', answer_aliases: ['Bolt'], difficulty: 1 },
  { category: 'Sports', question_text: 'This American swimmer has won 23 Olympic gold medals, more than any other Olympian in history, dominating events like the 200m butterfly and 200m individual medley. Name this athlete.', answer: 'Michael Phelps', answer_aliases: ['Phelps'], difficulty: 1 },
  { category: 'Sports', question_text: 'This American gymnast, considered the greatest of all time, has won a combined 37 World Championship and Olympic medals. She has four gymnastics skills named after her. Name this athlete.', answer: 'Simone Biles', answer_aliases: ['Biles'], difficulty: 1 },
  { category: 'Sports', question_text: 'This city hosted the first modern Olympic Games in 1896, reviving the ancient tradition. It hosted again in 2004. Name this Greek capital.', answer: 'Athens', answer_aliases: [], difficulty: 1 },

  // Hockey
  { category: 'Sports', question_text: 'This Canadian hockey player, known as "The Great One," holds over 60 NHL records including most career goals and assists. He played most notably for the Edmonton Oilers. Name this legend.', answer: 'Wayne Gretzky', answer_aliases: ['Gretzky', 'The Great One'], difficulty: 1 },
  { category: 'Sports', question_text: 'This NHL trophy, first awarded in 1893, is the oldest existing trophy to be awarded to a professional sports franchise in North America. Name this championship cup.', answer: 'Stanley Cup', answer_aliases: ['The Stanley Cup'], difficulty: 1 },

  // Boxing / MMA
  { category: 'Sports', question_text: 'This heavyweight boxing champion, known for declaring "I am the greatest" and his refusal to be drafted during the Vietnam War, was born Cassius Clay. Name this three-time world heavyweight champion.', answer: 'Muhammad Ali', answer_aliases: ['Ali', 'Cassius Clay'], difficulty: 1 },
  { category: 'Sports', question_text: 'This Irish MMA fighter became the first UFC fighter to hold titles in two weight classes simultaneously. Known for his brash personality, he fought Floyd Mayweather in a 2017 boxing match. Name this fighter.', answer: 'Conor McGregor', answer_aliases: ['McGregor'], difficulty: 1 },

  // Cricket
  { category: 'Sports', question_text: 'This Indian cricketer, known as the "Master Blaster," holds the record for most runs scored in both Test and ODI cricket, including 100 international centuries. Name this batsman.', answer: 'Sachin Tendulkar', answer_aliases: ['Tendulkar', 'Sachin'], difficulty: 2 },
  { category: 'Sports', question_text: 'This form of cricket, introduced in 2003, limits each team to 20 overs per innings and has spawned leagues like the Indian Premier League. Name this format.', answer: 'Twenty20', answer_aliases: ['T20', 'T20 cricket'], difficulty: 2 },

  // Formula 1
  { category: 'Sports', question_text: 'This British Formula 1 driver for Mercedes tied Michael Schumacher\'s record of seven World Drivers\' Championships. He was knighted in 2021. Name this racing driver.', answer: 'Lewis Hamilton', answer_aliases: ['Hamilton'], difficulty: 1 },
  { category: 'Sports', question_text: 'This Dutch Formula 1 driver for Red Bull Racing won his first World Championship in a controversial final lap in Abu Dhabi in 2021 and went on to dominate subsequent seasons. Name this driver.', answer: 'Max Verstappen', answer_aliases: ['Verstappen'], difficulty: 2 },

  // Track and Field
  { category: 'Sports', question_text: 'This American track and field athlete won four gold medals at the 1936 Berlin Olympics, embarrassing Adolf Hitler\'s claims of Aryan racial superiority. Name this sprinter and long jumper.', answer: 'Jesse Owens', answer_aliases: ['Owens'], difficulty: 2 },
  { category: 'Sports', question_text: 'This combined track and field event consists of ten events over two days, including the 100m, long jump, shot put, and 1500m. Name this athletic competition considered the ultimate test of versatility.', answer: 'Decathlon', answer_aliases: ['The Decathlon'], difficulty: 2 },

  // Swimming
  { category: 'Sports', question_text: 'This Australian swimmer, nicknamed "Thorpedo," won five Olympic gold medals specializing in freestyle events. He dominated the 2000 Sydney Olympics. Name this swimmer.', answer: 'Ian Thorpe', answer_aliases: ['Thorpe', 'Thorpedo'], difficulty: 3 },
  { category: 'Sports', question_text: 'This swimming stroke, performed face-down with simultaneous arm pulls and a dolphin kick, is generally considered the most difficult and energy-intensive competitive stroke. Name this stroke.', answer: 'Butterfly', answer_aliases: ['Butterfly stroke'], difficulty: 1 },

  // Gymnastics
  { category: 'Sports', question_text: 'This Romanian gymnast scored the first perfect 10 in Olympic gymnastics history at the 1976 Montreal Games on the uneven bars. She won three gold medals at those games. Name this gymnast.', answer: 'Nadia Comaneci', answer_aliases: ['Comaneci'], difficulty: 2 },

  // Records and Famous Moments
  { category: 'Sports', question_text: 'This legendary 1980 Olympic ice hockey game saw the amateur United States team defeat the heavily favored Soviet Union team 4-3. Al Michaels called it with "Do you believe in miracles?" Name this event.', answer: 'Miracle on Ice', answer_aliases: ['The Miracle on Ice'], difficulty: 2 },
  { category: 'Sports', question_text: 'This stadium, located in London, serves as the home of the English national football team and can seat over 90,000 spectators. Its original version, featuring twin towers, was demolished in 2003. Name this venue.', answer: 'Wembley Stadium', answer_aliases: ['Wembley'], difficulty: 2 },
  { category: 'Sports', question_text: 'In baseball, this rule states that a batter is out after accumulating three strikes. A foul ball counts as a strike only if the batter has fewer than two strikes. Name this rule.', answer: 'Three strikes rule', answer_aliases: ['Strikeout', 'Three strikes', 'Strike three'], difficulty: 1 },
  { category: 'Sports', question_text: 'This Ethiopian distance runner won the Olympic marathon barefoot in Rome in 1960 and defended his title in Tokyo in 1964. Name this legendary marathoner.', answer: 'Abebe Bikila', answer_aliases: ['Bikila'], difficulty: 4 },
  { category: 'Sports', question_text: 'This annual cycling race, held primarily in France over three weeks in July, is the most prestigious Grand Tour in professional cycling. Name this event.', answer: 'Tour de France', answer_aliases: ['Le Tour de France', 'Le Tour'], difficulty: 1 },
  { category: 'Sports', question_text: 'This NBA franchise, based in Boston, has won 17 championships, the most in league history. Bill Russell led them to eleven titles. Name this team whose home arena is TD Garden.', answer: 'Boston Celtics', answer_aliases: ['Celtics'], difficulty: 1 },
  { category: 'Sports', question_text: 'This Spanish footballer, who spent his entire career at FC Barcelona, is the club\'s all-time leading scorer. Known for his dribbling and vision, he retired in 2023 after winning numerous La Liga titles. Name this player.', answer: 'Lionel Messi', answer_aliases: ['Messi'], difficulty: 1 },
  { category: 'Sports', question_text: 'This heavyweight boxing match in 1974, held in Kinshasa, Zaire, saw Muhammad Ali use his "rope-a-dope" strategy to defeat George Foreman. Name this bout promoted by Don King.', answer: 'Rumble in the Jungle', answer_aliases: ['The Rumble in the Jungle'], difficulty: 2 },
  { category: 'Sports', question_text: 'This NFL team, based in Green Bay, Wisconsin, is the only community-owned major professional sports team in the United States. They play at Lambeau Field. Name this franchise.', answer: 'Green Bay Packers', answer_aliases: ['Packers'], difficulty: 1 },
];
