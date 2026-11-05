// KeyVerdict — local security engine (V3).
// All analysis is a pure, synchronous function of the input string.
// Nothing here touches the network or persists any value.

const COMMON_PASSWORDS = new Set([
  '123456', '123456789', 'password', 'password1', 'password123', 'qwerty', 'qwerty123',
  'letmein', 'welcome', 'admin', 'iloveyou', 'monkey', 'abc123', 'dragon',
  'football', 'baseball', 'princess', 'sunshine', 'master', 'login',
  '12345678', '1234567', '12345', '1234', '123', '1234567890', 'qwertyuiop',
  'asdfghjkl', 'zxcvbnm', 'password0', 'chromecast', 'dallas', 'charlie',
  'donald', 'samsung', 'passw0rd', 'starwars', 'trustno1', 'superman',
  'whatever', 'shadow', 'michael', 'jordan', 'harley', 'ranger', 'buster',
  'rockyou', 'butterfly', 'hunter', 'tigger', 'soccer', 'mustang', 'master1',
  '111111', '000000', '112233', '123123', '121212', '131313', '654321',
  '777777', '888888', '999999', '666666', '1q2w3e4r', '1qaz2wsx',
  'qazwsx', 'qweasd', 'zaq12wsx', '1qwerty', 'q1w2e3r4', 'zxcvbnm1',
  'password!', 'password1!', 'p@ssw0rd', 'p@ssword', 'welcome1', 'admin123',
  'administrator', 'root', 'toor', 'test', 'test123', 'demo', 'guest',
  'loveme', 'iloveu', 'whatever1', 'blink182', 'flower', 'hottie', 'love',
  'angel', 'nicole', 'chelsea', 'jessica', 'ashley', 'amanda', 'sarah',
  'jennifer', 'maggie', 'pepper', 'ginger', 'police', 'fireman', 'kitty',
  'stella', 'summer', 'winter', 'autumn', 'charlie1', 'daniel', 'matthew',
  'andrew', 'william', 'thomas', 'robert', 'george', 'joshua', 'justin',
  'anthony', 'kevin', 'brandon', 'jason', 'david', 'john', 'chris',
  'steve', 'mark', 'richard', 'brian', 'kevin1', 'austin', 'dallas1',
  'yankees', 'cowboys', 'packers', 'steelers', 'falcons', 'rangers',
  'nuggets', 'lakers', 'celtics', 'redsox', 'yankees1', 'soccer1',
  'baseball1', 'football1', 'hockey', 'golfer', 'tennis', 'racquet',
  'tracker', 'killer', 'warrior', 'ninja', 'samurai', 'dragon1',
  'phoenix', 'tiger', 'lionel', 'panther', 'eagle', 'falcon', 'hawk',
  'bear', 'wolf', 'shark', 'turtle', 'bunny', 'puppy', 'kitten',
  'cheese', 'burger', 'pizza', 'cookie', 'donut', 'candy', 'chocolate',
  'banana', 'orange', 'apple1', 'grape', 'melon', 'peach', 'berry',
  'chevy', 'ford', 'honda', 'toyota', 'nissan', 'dodge', 'jeep',
  'mercedes', 'bmw', 'audi', 'ferrari', 'lamborghini', 'porsche',
  'harley1', 'yamaha', 'suzuki', 'kawasaki', 'ducati',
  'fuckyou', 'shit', 'bitch', 'asshole', 'motherfucker', 'fuck',
  'sex', 'sexy', 'horny', 'naked', 'boobs', 'pussy',
  'monkey1', 'monkey123', 'dragonball', 'naruto', 'sasuke', 'pokemon',
  'pikachu', 'mario', 'luigi', 'zelda', 'link', 'kirby', 'sonic',
  'megaman', 'metroid', 'doom', 'quake', 'halo', 'gta', 'minecraft',
  'fortnite', 'minecraft1', 'roblox', 'amongus', 'discord', 'tiktok',
  'instagram', 'facebook', 'snapchat', 'twitter', 'youtube', 'netflix',
  'spotify', 'amazon', 'google', 'yahoo', 'hotmail', 'gmail',
  'outlook', 'icloud', 'paypal', 'ebay', 'walmart', 'target',
  'costco', 'cvs', 'walgreens', 'chase', 'wellsfargo', 'bankofamerica',
  'citibank', 'capitalone', 'discover', 'amex', 'visa', 'mastercard',
  'hello', 'hello1', 'helloworld', 'world', 'earth', 'sun', 'moon',
  'star', 'sky', 'fire', 'water', 'wind', 'earth1', 'metal', 'wood',
  'rock', 'stone', 'gold', 'silver', 'platinum', 'diamond', 'ruby',
  'emerald', 'sapphire', 'amber', 'jade', 'onyx', 'pearl',
  'yourname', 'myname', 'nickname', 'username', 'email', 'phonenumber',
  'birthday', 'birthdate', 'dateofbirth', 'dob', 'year', 'month',
  'week', 'today', 'tomorrow', 'yesterday',
  'chocolate1', 'cupcake', 'muffin', 'brownie', 'cake', 'pie',
  'icecream', 'milkshake', 'smoothie', 'coffee', 'tea', 'espresso',
  'latté', 'latte', 'cappuccino', 'mocha', 'frappe',
  'spiderman', 'superman1', 'batman', 'ironman', 'thor', 'hulk',
  'captainamerica', 'wolverine', 'deadpool', 'joker', 'riddler',
  'penguin', 'catwoman', 'supergirl', 'wonderwoman', 'aquaman',
  'flash', 'greenlantern', 'arrow', 'daredevil', 'punisher',
  'ghostrider', 'blade', 'hellboy', 'scream', 'freddy', 'jason',
  'michaelmyers', 'leatherface', 'chucky', 'annabelle', 'pennywise',
  'clown', 'zombie', 'vampire', 'werewolf', 'ghost', 'demon',
  'witch', 'wizard', 'witch1', 'potion', 'spell', 'curse',
  'magic', 'mystic', 'mythic', 'legend', 'myth', 'fable',
  'alice', 'wonderland', 'oz', 'wizardofoz', 'tinman', 'scarecrow',
  'cowardlylion', 'dorothy', 'toto', 'hobbit', 'frodo', 'samwise',
  'gandalf', 'aragorn', 'legolas', 'gimli', 'gollum', 'sauron',
  'mordor', 'shire', 'rivendell', 'gondor', 'rohan',
  'gryffindor', 'slytherin', 'ravenclaw', 'hufflepuff', 'hogwarts',
  'hermione', 'ron', 'harrypotter', 'voldemort', 'dumbledore',
  'snape', 'draco', 'luna', 'neville', 'ginny', 'hagrid',
  'starwars1', 'jedi', 'sith', 'lightsaber', 'darthvader', 'yoda',
  'chewbacca', 'han', 'leia', 'luke', 'obiwan', 'anakin',
  'padme', 'boba', 'jango', 'stormtrooper', 'droids', 'r2d2',
  'c3po', 'wookie', 'ewok', 'fett', 'kenobi', 'skywalker',
  'avengers', 'xmen', 'fantasticfour', 'justiceleague', 'guardians',
  'galaxy', 'universe', 'cosmos', 'nebula', 'galaxy1', 'quasar',
  'pulsar', 'comet', 'meteor', 'asteroid', 'planet', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'venus',
  'mercury', 'earthling', 'alien', 'ufo', 'spacex', 'nasa',
  'astronaut', 'cosmonaut', 'shuttle', 'rocket', 'satellite',
  'space', 'galaxy2', 'milkyway', 'andromeda', 'orion', 'bigdipper',
  'littledipper', 'northstar', 'polaris', 'vega', 'sirius',
  'canis', 'orion1', 'leo', 'gemini', 'taurus', 'aries',
  'cancer', 'virgo', 'libra', 'scorpio', 'sagittarius',
  'capricorn', 'aquarius', 'pisces', 'zodiac', 'horoscope',
]);

// QWERTY rows + numeric + a few very common "type safe" runs.
const SEQUENCES = [
  '1234567890', '0987654321', 'qwertyuiop', 'poiuytrewq',
  'asdfghjkl', 'lkjhgfdsa', 'zxcvbnm', 'mnbvcxz',
  'qwerty', 'asdf', 'zxcv', 'qwe', 'wer', 'ert', 'rty', 'tyu', 'yui',
  'uio', 'iop', 'asd', 'sdf', 'dfg', 'fgh', 'ghj', 'hjk', 'jkl',
  'zxc', 'xcv', 'cvb', 'vbn', 'bnm', '1qaz', '2wsx', '3edc',
  '4rfv', '5tgb', '6yhn', '7ujm', '8ik', '9ol', '0p', 'qaz',
  'wsx', 'edc', 'rfv', 'tgb', 'yhn', 'ujm', 'ik', 'ol', 'p',
  'zaq', 'xsw', 'cde', 'vfr', 'bgt', 'nhy', 'mju', 'ki', 'lo',
  'p0', 'abcdef', 'abcdefg', 'abcdefgh', 'abcd', 'bcde', 'cdef',
  'defg', 'efgh', 'fghi', 'ghij', 'hijk', 'ijkl', 'jklm', 'klmn',
  'lmno', 'mnop', 'nopq', 'opqr', 'pqrs', 'qrst', 'rstu', 'stuv',
  'tuvw', 'uvwx', 'vwxy', 'wxyz', 'abc', 'bcd', 'cde1', 'def',
  'efg', 'fgh1', 'ghi', 'hij', 'ijk', 'jkl1', 'klm', 'lmn',
  'mno', 'nop', 'opq', 'pqr', 'qrs', 'rst', 'stu', 'tuv', 'uvw',
  'vwx', 'wxy', 'xyz', '0123', '1234', '2345', '3456', '4567',
  '5678', '6789', '7890', '8901', '9012', '012', '123', '234',
  '345', '456', '567', '678', '789', '890', '901', '0123', '1234',
  'ab', 'cd', 'ef', 'gh', 'ij', 'kl', 'mn', 'op', 'qr', 'st',
  'uv', 'wx', 'yz', '0', '1', '2', '3', '4', '5', '6', '7',
  '8', '9', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o',
  'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z',
  'x', 'c', 'v', 'b', 'n', 'm', 'qwertyuiopasdfghjklzxcvbnm',
  'asdfghjklqwertyuiopzxcvbnm', 'zxcvbnmqwertyuiopasdfghjkl',
];

// Common years people append (birth years, celebrations).
const COMMON_YEARS = ['1990','1991','1992','1993','1994','1995','1996','1997','1998','1999','2000','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025','1980','1981','1982','1983','1984','1985','1986','1987','1988','1989','1970','1971','1972','1973','1974','1975','1976','1977','1978','1979','1960','1961','1962','1963','1964','1965','1966','1967','1968','1969'];

// Leetspeak letters -> real letters, so "p@ssw0rd" still counts as a word.
const LEET_MAP = {
  '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '6': 'g',
  '7': 't', '8': 'b', '9': 'q', '@': 'a', '$': 's', '!': 'i',
  '+': 't',
};

function leetToPlain(value) {
  return value.toLowerCase().split('').map((ch) => LEET_MAP[ch] || ch).join('');
}

function hasSequence(value) {
  const normalized = value.toLowerCase();
  const plain = leetToPlain(normalized);
  return SEQUENCES.some((sequence) => {
    if (sequence.length < 4) return false;
    for (let index = 0; index <= sequence.length - 4; index += 1) {
      const chunk = sequence.slice(index, index + 4);
      if (normalized.includes(chunk) || plain.includes(chunk)) return true;
      const rev = [...chunk].reverse().join('');
      if (normalized.includes(rev) || plain.includes(rev)) return true;
    }
    return false;
  });
}

// Detect any 4+ repeated char run (aaaa, 1111) and any repeated 3-char chunk.
function hasRepeats(value) {
  const v = value.toLowerCase();
  if (/(.)\1{3,}/.test(v)) return true;
  for (let i = 0; i <= v.length - 6; i += 1) {
    const chunk = v.slice(i, i + 3);
    if (v.indexOf(chunk, i + 3) !== -1) return true;
  }
  return false;
}

// Detect common years and date-like fragments.
function hasDatePattern(value) {
  const lower = value.toLowerCase();
  if (COMMON_YEARS.some((year) => lower.includes(year))) return true;
  // numeric date fragments like 010120, 12-31, 25/12
  return /\b\d{1,4}[-/.]\d{1,2}[-/.]\d{1,4}\b/.test(value)
    || /\b(0[1-9]|1[0-2])[-/.](0[1-9]|[12]\d|3[01])\b/.test(value);
}

// Detect words that are very common dictionary / keyboard-mash fragments.
const COMMON_WORDS = new Set([
  'password', 'pass', 'word', 'qwerty', 'letmein', 'welcome', 'admin',
  'iloveyou', 'monkey', 'dragon', 'football', 'baseball', 'princess',
  'sunshine', 'master', 'login', 'secret', 'hello', 'love', 'star',
  'super', 'jesus', 'god', 'money', 'death', 'fear', 'rock', 'fire',
  'water', 'earth', 'wind', 'school', 'college', 'university', 'campus',
  'student', 'teacher', 'professor', 'office', 'company', 'business',
  'corp', 'company1', 'team', 'group', 'email', 'phone', 'home',
  'house', 'family', 'friend', 'brother', 'sister', 'mother', 'father',
  'mom', 'dad', 'son', 'daughter', 'baby', 'kid', 'children', 'wife',
  'husband', 'spouse', 'partner', 'guy', 'girl', 'boy', 'man', 'woman',
  'person', 'people', 'human', 'apple', 'orange', 'banana', 'grape',
  'cherry', 'mango', 'peach', 'lemon', 'lime', 'berry', 'cookie',
  'cake', 'pie', 'sugar', 'salt', 'pepper', 'spice', 'honey',
  'butter', 'cheese', 'milk', 'cream', 'yogurt', 'egg', 'bread',
  'rice', 'noodles', 'pasta', 'pizza', 'burger', 'sandwich', 'taco',
  'burrito', 'sushi', 'ramen', 'burger', 'fries', 'chips', 'popcorn',
  'nachos', 'donut', 'muffin', 'cinnamon', 'vanilla', 'chocolate',
  'strawberry', 'blueberry', 'raspberry', 'blackberry', 'orange',
  'purple', 'yellow', 'green', 'blue', 'red', 'pink', 'brown',
  'black', 'white', 'gray', 'grey', 'silver', 'gold', 'bronze',
  'copper', 'iron', 'steel', 'titanium', 'cobalt', 'nickel',
  'platinum', 'radium', 'uranium', 'plutonium', 'neon', 'argon',
  'krypton', 'xenon', 'radon', 'helium', 'hydrogen', 'oxygen',
  'nitrogen', 'carbon', 'calcium', 'sodium', 'potassium',
  'magnesium', 'aluminum', 'silicon', 'sulfur', 'phosphorus',
  'chlorine', 'iodine', 'fluorine', 'bromine', 'selenium',
  'moon', 'sun', 'jupiter', 'saturn', 'mars', 'venus', 'mercury',
  'neptune', 'uranus', 'pluto', 'earth', 'galaxy', 'universe',
  'cosmos', 'nebula', 'asteroid', 'comet', 'meteor', 'star',
  'sunset', 'sunrise', 'dusk', 'dawn', 'twilight', 'midnight',
  'morning', 'evening', 'afternoon', 'day', 'night', 'week',
  'month', 'year', 'birthday', 'anniversary', 'christmas', 'easter',
  'halloween', 'thanksgiving', 'newyear', 'valentine', 'stpatrick',
  'july', 'august', 'september', 'october', 'november', 'december',
  'january', 'february', 'march', 'april', 'may', 'june',
  'london', 'paris', 'newyork', 'tokyo', 'berlin', 'rome',
  'moscow', 'beijing', 'delhi', 'mumbai', 'sydney', 'toronto',
  'chicago', 'houston', 'phoenix', 'philadelphia', 'sanantonio',
  'sandiego', 'dallas', 'sanfrancisco', 'seattle', 'denver',
  'boston', 'miami', 'atlanta', 'lasvegas', 'portland', 'detroit',
  'cincinnati', 'cleveland', 'columbus', 'indianapolis', 'milwaukee',
  'minneapolis', 'nashville', 'neworleans', 'oklahoma', 'orlando',
  'pittsburgh', 'sacramento', 'stlouis', 'tampa', 'tucson',
  'washington', 'austin', 'kansas', 'louisville', 'memphis',
  'richmond', 'rochester', 'saltlake', 'albuquerque', 'anchorage',
  'boise', 'buffalo', 'charlotte', 'raleigh', 'sanjose',
  'santafe', 'spokane', 'tucson', 'wichita', 'anchorage',
  'honolulu', 'desmoines', 'little rock', 'madison', 'newark',
  'norfolk', 'omaha', 'pensacola', 'providence', 'raleigh',
  'sioux', 'tallahassee', 'trenton', 'wichita', 'albany',
  'annapolis', 'austin', 'bismarck', 'boise', 'carson', 'charleston',
  'cheyenne', 'columbia', 'concord', 'delaware', 'denver',
  'desmoines', 'dover', 'frankfort', 'harrisburg', 'hartford',
  'helena', 'honolulu', 'indianapolis', 'jackson', 'jefferson',
  'juneau', 'lansing', 'lincoln', 'little', 'madison', 'montgomery',
  'montpelier', 'nashville', 'oklahoma', 'olympia', 'phoenix',
  'pierre', 'providence', 'raleigh', 'richmond', 'sacramento',
  'saint', 'salem', 'salt', 'santa', 'springfield', 'stpaul',
  'tallahassee', 'topeka', 'trenton', 'washington', 'albany',
  'annapolis', 'atlanta', 'augusta', 'austin', 'baton', 'bismarck',
  'boise', 'boston', 'carson', 'charleston', 'charlotte',
  'cheyenne', 'columbia', 'columbus', 'concord', 'denver',
  'desmoines', 'detroit', 'dover', 'frankfort', 'harrisburg',
  'hartford', 'helena', 'honolulu', 'indianapolis', 'jackson',
  'jefferson', 'juneau', 'lansing', 'lincoln', 'little', 'madison',
  'montgomery', 'montpelier', 'nashville', 'oklahoma', 'olympia',
  'phoenix', 'pierre', 'providence', 'raleigh', 'richmond',
  'sacramento', 'saint', 'salem', 'salt', 'santa', 'springfield',
  'stpaul', 'tallahassee', 'topeka', 'trenton', 'washington',
]);

// Detect if the (de-leeted, de-punctuated) password is basically a known word
// with predictable decorations, or contains a dictionary word as a majority.
function containsDictionaryWord(value) {
  const plain = leetToPlain(value).toLowerCase().replace(/[^a-z0-9]/g, '');
  if (plain.length < 4) return false;
  // exact single word with decorations
  if (COMMON_WORDS.has(plain)) return true;
  for (const word of COMMON_WORDS) {
    if (word.length >= 4 && plain.includes(word) && plain.length <= word.length + 4) {
      return true;
    }
  }
  return false;
}

function hasKeyboardRun(value) {
  const lower = value.toLowerCase();
  if (hasSequence(lower)) return true;
  // repeated single row alternation like "qaz", "wert"
  return /([qwertyuiop]{4,})/.test(lower)
    || /([asdfghjkl]{4,})/.test(lower)
    || /([zxcvbnm]{4,})/.test(lower);
}

function hasPersonalInfo(value) {
  const lower = value.toLowerCase();
  // simple proxy: info/username/email/phone/name words
  return /(username|email|phone|home|name|birth|year|date|address|ssn|passport|driver)/.test(lower)
    || /(197[0-9]|198[0-9]|199[0-9]|20[0-2][0-9])/.test(value);
}

function formatGuessTime(seconds) {
  if (seconds < 1) return 'less than a second';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 31557600) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 31557600 * 100) return `${Math.round(seconds / 31557600)} years`;
  if (seconds < 31557600 * 1000000) return `${Math.round(seconds / 31557600 / 1000)}k years`;
  return 'centuries';
}

// Effective charset size from which the password draws characters.
function charsetSize(checks) {
  let size = 0;
  if (checks.lowercase) size += 26;
  if (checks.uppercase) size += 26;
  if (checks.number) size += 10;
  if (checks.symbol) size += 33;
  return size || 36;
}

// Shannon entropy estimate over the used character set, reduced when the
// string is dominated by a single class or has heavy repetition.
function estimateEntropy(value, checks) {
  if (!value) return 0;
  const size = charsetSize(checks);
  let entropy = value.length * Math.log2(size);

  if (checks.unique) {
    // fewer distinct chars -> lower effective entropy
    const distinct = new Set(value.toLowerCase()).size;
    if (distinct < value.length) {
      entropy -= (value.length - distinct) * 0.5;
    }
  }

  if (checks.common) entropy = Math.min(entropy, 20);
  if (hasDatePattern(value)) entropy -= 8;
  if (checks.repeated) entropy -= 6;
  if (checks.sequence) entropy -= 8;
  if (containsDictionaryWord(value)) entropy -= 10;
  if (checks.keyboard) entropy -= 6;

  return Math.max(0, Math.round(entropy));
}

export function analyzePassword(password = '') {
  const value = typeof password === 'string' ? password : '';
  const lower = value.toLowerCase();

  const sequence = hasSequence(value);
  const common = COMMON_PASSWORDS.has(lower);
  const checks = {
    length: value.length >= 12,
    longLength: value.length >= 16,
    lowercase: /[a-z]/.test(value),
    uppercase: /[A-Z]/.test(value),
    number: /\d/.test(value),
    symbol: /[^A-Za-z0-9]/.test(value),
    unique: new Set(value).size >= Math.max(6, Math.floor(value.length * 0.65)),
    common,
    sequence,
    repeated: hasRepeats(value),
    keyboard: hasKeyboardRun(value) && !sequence,
    date: hasDatePattern(value),
    personal: hasPersonalInfo(value),
    dictionary: containsDictionaryWord(value) && !common,
  };

  if (!value) {
    return {
      score: 0,
      percentage: 0,
      label: 'Waiting for input',
      tone: 'neutral',
      entropy: 0,
      guessTime: 'not estimated',
      checks,
      feedback: 'Start with a private phrase. Nothing is sent anywhere.',
    };
  }

  let points = 0;
  if (checks.length) points += 18;
  if (checks.longLength) points += 14;
  if (checks.lowercase) points += 8;
  if (checks.uppercase) points += 8;
  if (checks.number) points += 8;
  if (checks.symbol) points += 12;
  if (checks.unique) points += 12;
  if (checks.common) points -= 55;
  if (checks.sequence) points -= 18;
  if (checks.repeated) points -= 12;
  if (checks.keyboard) points -= 10;
  if (checks.date) points -= 10;
  if (checks.personal) points -= 8;
  if (checks.dictionary) points -= 14;

  // Also factor length for very long values even if classes are partial
  if (value.length >= 20) points += 5;
  if (value.length <= 6) points -= 10;

  const score = Math.max(0, Math.min(4, Math.ceil(points / 25)));
  const labels = ['Very weak', 'Weak', 'Fair', 'Strong', 'Excellent'];
  const tones = ['danger', 'danger', 'warning', 'good', 'good'];

  const entropy = estimateEntropy(value, checks);
  // Offline GPU/cloud guessing: ~1e10 guesses/sec is a realistic "smart password
  // cracker" baseline; a good hash would make this far slower in reality.
  const guessesPerSecond = 1e10;
  const guessSeconds = Math.pow(2, Math.min(entropy, 200)) / guessesPerSecond / 2;

  const feedback = checks.common
    ? 'This password is on known breach lists. Start over with unrelated words.'
    : checks.dictionary || checks.sequence || checks.repeated || checks.keyboard
      ? 'Predictable words or runs make this easy for attackers. Mix unusual words with symbols and numbers.'
      : checks.date || checks.personal
        ? 'Dates and personal details are guessable from public info. Avoid them entirely.'
        : score >= 3
          ? 'Good structure. Keep it unique to this service and protect it with MFA.'
          : 'Add length and variety, avoid repeated characters, and don’t reuse this elsewhere.';

  return {
    score,
    percentage: score === 4 ? 100 : Math.max(2, Math.min(100, Math.round((points + 62) * 100 / 162))),
    label: labels[score],
    tone: tones[score],
    entropy,
    guessTime: formatGuessTime(guessSeconds),
    checks,
    feedback,
  };
}

// ---- Generator ------------------------------------------------------------
// We use cryptographically strong randomness (Web Crypto) with rejection
// sampling to avoid modulo bias. The output guarantees at least one character
// from every class and avoids predictable adjacent runs.

// Ambiguous-looking chars excluded when that option is on.
const AMBIGUOUS_CHARS = new Set(['l', 'I', 'O', '0', '1']);

function secureRandomIndex(max) {
  const cryptoApi = globalThis.crypto;
  if (!cryptoApi?.getRandomValues) throw new Error('Secure random generation is unavailable in this browser.');
  const limit = Math.floor(0x100000000 / max) * max;
  const buffer = new Uint32Array(1);
  do {
    cryptoApi.getRandomValues(buffer);
  } while (buffer[0] >= limit);
  return buffer[0] % max;
}

function shuffleArray(array) {
  for (let index = array.length - 1; index > 0; index -= 1) {
    const swapIndex = secureRandomIndex(index + 1);
    [array[index], array[swapIndex]] = [array[swapIndex], array[index]];
  }
  return array;
}

export function generatePassword(length = 20, options = {}) {
  const {
    lowercase = true,
    uppercase = true,
    numbers = true,
    symbols = true,
    excludeAmbiguous = false,
  } = options;

  const safeLength = Math.max(12, Math.min(64, Number(length) || 20));

  if (typeof globalThis === 'undefined' || !globalThis.crypto?.getRandomValues) {
    throw new Error('Secure random generation is unavailable in this browser.');
  }

  const rawSets = {
    lower:  'abcdefghijklmnopqrstuvwxyz',
    upper:  'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    number: '0123456789',
    symbol: '!@#$%^&*_-+=',
  };

  function strip(str) {
    return excludeAmbiguous ? str.split('').filter((c) => !AMBIGUOUS_CHARS.has(c)).join('') : str;
  }

  // Build enabled sets from checkboxes
  const enabledSets = [];
  if (lowercase) { const s = strip(rawSets.lower);  if (s) enabledSets.push(s); }
  if (uppercase) { const s = strip(rawSets.upper);  if (s) enabledSets.push(s); }
  if (numbers)   { const s = strip(rawSets.number); if (s) enabledSets.push(s); }
  if (symbols)   { enabledSets.push(rawSets.symbol); }

  // Always keep at least lowercase as a fallback
  if (enabledSets.length === 0) enabledSets.push(strip(rawSets.lower) || rawSets.lower);

  const allChars = enabledSets.join('');

  // Guarantee at least one char from every enabled set
  const result = enabledSets.map((set) => set[secureRandomIndex(set.length)]);
  while (result.length < safeLength) {
    result.push(allChars[secureRandomIndex(allChars.length)]);
  }

  shuffleArray(result);

  // Avoid three-identical consecutive characters (no "aaa" / "111").
  let cleaned = result.join('');
  let guard = 0;
  while (/(.)\1{2,}/.test(cleaned) && guard++ < 100) {
    const match = cleaned.match(/(.)\1{2,}/);
    if (!match) break;
    const idx = cleaned.indexOf(match[0]);
    cleaned = cleaned.slice(0, idx + 1) + allChars[secureRandomIndex(allChars.length)] + cleaned.slice(idx + 3);
  }

  return cleaned;
}

export async function copyToClipboard(value) {
  if (!value || !navigator.clipboard?.writeText) return false;
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}
