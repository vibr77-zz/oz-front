<?php

/**
 * PHP class to use Freebox HD virtual remote API
 * 
 * Since firmware  1.6.4, the Freebox HD (http://www.free.fr) can be controlled via HTTP requests 
 * just as the real (physical) remote.
 * 
 * @author DUVERGIER Claude <claude@duvergier.fr>
 * @link http://c.duvergier.free.fr/portfolio/developpements/freebox/freemote/
 * 
 * @version $Id: FreemoteApi.php 9 2011-09-22 22:32:01Z claude-duvergier $
 */
class FreemoteApi
{
    /* ************************************************************************ *
        Working constants
     * ************************************************************************ */
    
    /**
     * HTTP adapter to use to send commands
     * Uses get_headers() by default
     *
     * @var string
     */
    const DEFAULT_HTTPADAPTER = self::HTTPADAPTER_GETHEADERS;
    
    /**
     * HTTP adapter to use to send commands
     * Uses get_headers() by default
     *
     * @var string
     */
    const HTTPADAPTER_GETHEADERS = 'get_headers';
    
    /**
     * Logical internal pseudo-command to handle waits 
     *
     * @var string
     */
    const WAIT_COMMAND = 'FreemoteApi-WaitCommand';
    /* ************************************************************************ */
    
    
    
    /* ************************************************************************ *
        URL API
     * ************************************************************************ */
    
    /**
     * API URL to control first box
     *
     * @var string
     */
    const HD1_URL = 'http://hd1.freebox.fr/pub/remote_control';
    
    /**
     * API URL to control second box
     *
     * @var string
     */
    const HD2_URL = 'http://hd2.freebox.fr/pub/remote_control';
    
    /**
     * API URL parameter specifying the remote authorization code
     *
     * @var string
     */
    const URLPARAM_CODE       = 'code';
    
    /**
     * API URL parameter specifying the key to activate
     *
     * @var string
     */
    const URLPARAM_KEY        = 'key';
    
    /**
     * API URL parameter specifying the type of pressure to apply 
     *
     * @var string
     */
    const URLPARAM_LONG       = 'long';
    
    /**
     * API URL parameter specifying the number of time to repeat the key
     *
     * @var string
     */
    const URLPARAM_REPETITION = 'repeat';
    /* ************************************************************************ */
    
    
    
    /* ************************************************************************ *
        Keys constants
     * ************************************************************************ */
    
    /**
     * Physical remote gaming-related keys
     *
     * @var string
     */
    const KEY_START  = 'start';
    const KEY_SELECT = 'select';
    
    /**
     * Physical remote top/right area keys
     *
     * @var string
     */
    const KEY_BLUE   = 'blue';
    const KEY_GREEN  = 'green';
    const KEY_RED    = 'red';
    const KEY_YELLOW = 'yellow';
    
    const KEY_A = 'green';
    const KEY_B = 'red';
    const KEY_X = 'blue';
    const KEY_Y = 'yellow';
    
    
    /**
     * Physical remote keypad area keys
     *
     * @var string
     */
    const KEY_POWER = 'power';
    const KEY_LIST  = 'list';
    const KEY_TV    = 'tv';
    
    const KEY_1 = '1';
    const KEY_2 = '2';
    const KEY_3 = '3';
    const KEY_4 = '4';
    const KEY_5 = '5';
    const KEY_6 = '6';
    const KEY_7 = '7';
    const KEY_8 = '8';
    const KEY_9 = '9';
    const KEY_0 = '0';
    
    const KEY_BACK = 'back';
    const KEY_SWAP = 'swap';
    
    const KEY_INFO = 'info';
    const KEY_MAIL = 'mail';
    const KEY_HELP = 'help';
    const KEY_PIP  = 'pip';
    
    const KEY_EPG     = 'epg';
    const KEY_MEDIA   = 'media';
    const KEY_OPTIONS = 'options';
    
    
    /**
     * Physical remote joystick area keys
     *
     * @var string
     */
    const KEY_VOLUMEUP   = 'vol_inc';
    const KEY_VOLUMEDOWN = 'vol_dec';
    
    const KEY_UP    = 'up';
    const KEY_RIGHT = 'right';
    const KEY_DOWN  = 'down';
    const KEY_LEFT  = 'left';
    const KEY_OK    = 'ok';
    
    const KEY_PROGRAMUP   = 'prgm_inc';
    const KEY_PROGRAMDOWN = 'prgm_dec';
    
    
    /**
     * Physical remote playback area keys
     *
     * @var string
     */
    const KEY_MUTE = 'mute';
    const KEY_FREE = 'home';
    const KEY_HOME = 'home';
    const KEY_RECORD   = 'rec';
    const KEY_BACKWARD = 'bwd';
    const KEY_PLAY     = 'play';
    const KEY_PAUSE    = 'play';
    const KEY_FORWARD  = 'fwd';
    const KEY_PREVIOUS = 'prev';
    const KEY_NEXT     = 'next';
    /* ************************************************************************ */
    
    
    
    /* ************************************************************************ *
        Keyboard feature variables
     * ************************************************************************ */

    /**
    The following mapping arrays were created via "keyMappingGenerator.php" from:
        $charactersList = array(
            '1' => '.,?!-\'"1',
            '2' => 'abc2àáâãäåæç',
            '3' => 'def3éèêë',
            '4' => 'ghi4ìíîï',
            '5' => 'jkl5',
            '6' => 'mno6ñòóôõöø',
            '7' => 'pqrs7$ß',
            '8' => 'tuv8ùúûü',
            '9' => 'wxyz9ýÿ',
            '0' => ' 0',
        );
    **/
    
    /**
     * Gives the list of characters that are associated to each keys
     * 
     * @var array
     */
    protected $_keypad_availableCharacters = array(
        self::KEY_1 => array('.', ',', '?', '!', '-', '\'', '\"', '1', ),
        self::KEY_2 => array('a', 'b', 'c', '2', 'à', 'á', 'â', 'ã', 'ä', 'å', 'æ', 'ç', ),
        self::KEY_3 => array('d', 'e', 'f', '3', 'é', 'è', 'ê', 'ë', ),
        self::KEY_4 => array('g', 'h', 'i', '4', 'ì', 'í', 'î', 'ï', ),
        self::KEY_5 => array('j', 'k', 'l', '5', ),
        self::KEY_6 => array('m', 'n', 'o', '6', 'ñ', 'ò', 'ó', 'ô', 'õ', 'ö', 'ø', ),
        self::KEY_7 => array('p', 'q', 'r', 's', '7', '$', 'ß', ),
        self::KEY_8 => array('t', 'u', 'v', '8', 'ù', 'ú', 'û', 'ü', ),
        self::KEY_9 => array('w', 'x', 'y', 'z', '9', 'ý', 'ÿ', ),
        self::KEY_0 => array(' ', '0', ),
    
    );
    
    /**
     * Gives associated key and position for each characters
     * 
     * @var array
     */
    protected $_keypad_char2keyMapping = array(
        
        '.'  => array('key' => self::KEY_1, 'pos' => 0),
        ','  => array('key' => self::KEY_1, 'pos' => 1),
        '?'  => array('key' => self::KEY_1, 'pos' => 2),
        '!'  => array('key' => self::KEY_1, 'pos' => 3),
        '-'  => array('key' => self::KEY_1, 'pos' => 4),
        '\'' => array('key' => self::KEY_1, 'pos' => 5),
        '\"' => array('key' => self::KEY_1, 'pos' => 6),
        '1'  => array('key' => self::KEY_1, 'pos' => 7),
        
        'a' => array('key' => self::KEY_2, 'pos' => 0),
        'b' => array('key' => self::KEY_2, 'pos' => 1),
        'c' => array('key' => self::KEY_2, 'pos' => 2),
        '2' => array('key' => self::KEY_2, 'pos' => 3),
        'à' => array('key' => self::KEY_2, 'pos' => 4),
        'á' => array('key' => self::KEY_2, 'pos' => 5),
        'â' => array('key' => self::KEY_2, 'pos' => 6),
        'ã' => array('key' => self::KEY_2, 'pos' => 7),
        'ä' => array('key' => self::KEY_2, 'pos' => 8),
        'å' => array('key' => self::KEY_2, 'pos' => 9),
        'æ' => array('key' => self::KEY_2, 'pos' => 10),
        'ç' => array('key' => self::KEY_2, 'pos' => 11),
        
        'd' => array('key' => self::KEY_3, 'pos' => 0),
        'e' => array('key' => self::KEY_3, 'pos' => 1),
        'f' => array('key' => self::KEY_3, 'pos' => 2),
        '3' => array('key' => self::KEY_3, 'pos' => 3),
        'é' => array('key' => self::KEY_3, 'pos' => 4),
        'è' => array('key' => self::KEY_3, 'pos' => 5),
        'ê' => array('key' => self::KEY_3, 'pos' => 6),
        'ë' => array('key' => self::KEY_3, 'pos' => 7),
        
        'g' => array('key' => self::KEY_4, 'pos' => 0),
        'h' => array('key' => self::KEY_4, 'pos' => 1),
        'i' => array('key' => self::KEY_4, 'pos' => 2),
        '4' => array('key' => self::KEY_4, 'pos' => 3),
        'ì' => array('key' => self::KEY_4, 'pos' => 4),
        'í' => array('key' => self::KEY_4, 'pos' => 5),
        'î' => array('key' => self::KEY_4, 'pos' => 6),
        'ï' => array('key' => self::KEY_4, 'pos' => 7),
        
        'j' => array('key' => self::KEY_5, 'pos' => 0),
        'k' => array('key' => self::KEY_5, 'pos' => 1),
        'l' => array('key' => self::KEY_5, 'pos' => 2),
        '5' => array('key' => self::KEY_5, 'pos' => 3),
        
        'm' => array('key' => self::KEY_6, 'pos' => 0),
        'n' => array('key' => self::KEY_6, 'pos' => 1),
        'o' => array('key' => self::KEY_6, 'pos' => 2),
        '6' => array('key' => self::KEY_6, 'pos' => 3),
        'ñ' => array('key' => self::KEY_6, 'pos' => 4),
        'ò' => array('key' => self::KEY_6, 'pos' => 5),
        'ó' => array('key' => self::KEY_6, 'pos' => 6),
        'ô' => array('key' => self::KEY_6, 'pos' => 7),
        'õ' => array('key' => self::KEY_6, 'pos' => 8),
        'ö' => array('key' => self::KEY_6, 'pos' => 9),
        'ø' => array('key' => self::KEY_6, 'pos' => 10),
        
        'p' => array('key' => self::KEY_7, 'pos' => 0),
        'q' => array('key' => self::KEY_7, 'pos' => 1),
        'r' => array('key' => self::KEY_7, 'pos' => 2),
        's' => array('key' => self::KEY_7, 'pos' => 3),
        '7' => array('key' => self::KEY_7, 'pos' => 4),
        '$' => array('key' => self::KEY_7, 'pos' => 5),
        'ß' => array('key' => self::KEY_7, 'pos' => 6),
        
        't' => array('key' => self::KEY_8, 'pos' => 0),
        'u' => array('key' => self::KEY_8, 'pos' => 1),
        'v' => array('key' => self::KEY_8, 'pos' => 2),
        '8' => array('key' => self::KEY_8, 'pos' => 3),
        'ù' => array('key' => self::KEY_8, 'pos' => 4),
        'ú' => array('key' => self::KEY_8, 'pos' => 5),
        'û' => array('key' => self::KEY_8, 'pos' => 6),
        'ü' => array('key' => self::KEY_8, 'pos' => 7),
        
        'w' => array('key' => self::KEY_9, 'pos' => 0),
        'x' => array('key' => self::KEY_9, 'pos' => 1),
        'y' => array('key' => self::KEY_9, 'pos' => 2),
        'z' => array('key' => self::KEY_9, 'pos' => 3),
        '9' => array('key' => self::KEY_9, 'pos' => 4),
        'ý' => array('key' => self::KEY_9, 'pos' => 5),
        'ÿ' => array('key' => self::KEY_9, 'pos' => 6),
        
        ' ' => array('key' => self::KEY_0, 'pos' => 0),
        '0' => array('key' => self::KEY_0, 'pos' => 1),
    );
    /* ************************************************************************ */
    
    
    
    /* ************************************************************************ *
        Working attributes
     * ************************************************************************ */

    /**
     * The virtual remote code
     * 
     * @var integer
     */
    protected $_virtualRemoteCode;
    
    /**
     * The TV box's number
     * 
     * @var integer
     */
    protected $_tvBoxNumber;
    
    /**
     * URL used as base to command sending
     * 
     * @var string
     */
    protected $_baseUrl;
    
    /**
     * Debug mode
     * 
     * @var boolean
     */
    protected $_debug   = false;
    
    /**
     * Options
     * 
     * @var array
     */
    protected $_options = array();
    /* ************************************************************************ */
    
    
    
    /* ************************************************************************ *
        Constructor
     * ************************************************************************ */

    /**
     * Instantiate a new API
     * 
     * @param integer   $remoteCode     The virtual remote code
     * @param integer   $tvBox          (Optional) The Freebox HD's number (either 1 or 2)
     */
    public function __construct ($remoteCode, $tvBox = 1)
    {
        $this->_setVirtualRemoteCode((int) $remoteCode);
        $this->_setTvBoxNumber((int) $tvBox);
    }
    /* ************************************************************************ */
    
    
    
    /* ************************************************************************ *
        Status methods
     * ************************************************************************ */
    
    /**
     * Test the connection
     * 
     * @return boolean
     */
    public function testConnection ()
    {
        // @TODO: Really test the connection
        return true;
    }
    
    /* ************************************************************************ */
    
    
    /* ************************************************************************ *
        Options
     * ************************************************************************ */
    
    /**
     * Set an option
     * 
     * @param string $key       The option name
     * @param mixed  $value     The option value
     */
    public function setOption ($key, $value)
    {
        $this->_options[$key] = $value;
    }
    
    /**
     * Retrieve an option
     * 
     * @param string $key   The option name
     * 
     * @return mixed    The option's value, <code>null</code> if not found
     */
    public function getOption ($key)
    {
        if (array_key_exists($key, $this->_options)) {
            return $this->_options[$key];
        }
        else {
            return null;
        }
    }
    /* ************************************************************************ */
    
    
    
    /* ************************************************************************ *
        Getters and Setters
     * ************************************************************************ */

    /**
     * Get all command keys sendable to the Freebox HD
     * 
     * @return array    An array of the commands, the array keys (indexes) are the name of the FreemoteApi constants
     */
    public function getKeys ()
    {
        $reflectedClass = new ReflectionClass($this);
        $keys = array();
        foreach ($reflectedClass->getConstants() as $name => $value) {
            if (strpos($name, 'KEY_', 0) === 0) {
                $keys[$name] = $value;
            }
        }
        return $keys;
    }
    
    
    /**
     * Get the virtual remote code
     * 
     * @return integer  The virtual remote code
     */
    public function getVirtualRemoteCode ()
    {
        return $this->_virtualRemoteCode;
    }
    
    /**
     * Set the virtual remote code
     * 
     * @param integer $virtualRemoteCode    The virtual remote code
     * 
     * @throws Exception if $virtualRemoteCode is incorrect
     */
    protected function _setVirtualRemoteCode ($virtualRemoteCode)
    {
        if (!is_int($virtualRemoteCode) || $virtualRemoteCode <= 0) {
            throw new Exception('"' . $virtualRemoteCode . '" is an incorrect remote code');
        }
        
        $this->_virtualRemoteCode = $virtualRemoteCode;
    }
    
    
    /**
     * Get the number of the TV box
     * 
     * @return integer  The number of the TV box
     */
    public function getTvBoxNumber ()
    {
        return $this->_tvBoxNumber;
    }
    
    /**
     * Set the TV box's number
     * 
     * @param integer $tvBoxNumber  The number (either 1 or 2)
     * 
     * @throws Exception if $tvBoxNumber is incorrect
     */
    protected function _setTvBoxNumber ($tvBoxNumber)
    {
        if (!is_int($tvBoxNumber) || ($tvBoxNumber != 1 && $tvBoxNumber != 2)) {
            throw new Exception('"' . $tvBoxNumber . '" is an incorrect TV box number');
        }
        
        $this->_tvBoxNumber = $tvBoxNumber;
        
        switch ($this->_tvBoxNumber) {
            case 2:
                $this->_setBaseUrl(self::HD2_URL);
                break;
            case 1:
            default:
                $this->_setBaseUrl(self::HD1_URL);
                break;
        }
    }
    
    
    /**
     * Set the base URL for API calls
     * 
     * @param string $baseUrl   The base URL
     * 
     * @throws Exception if $baseUrl is incorrect
     */
    protected function _setBaseUrl ($baseUrl)
    {
        if (!is_string($baseUrl) || parse_url($baseUrl) === false) {
            throw new Exception('"' . $baseUrl . '" is an incorrect URL');
        }
        
        $this->_baseUrl = $baseUrl;
    }
    /* ************************************************************************ */
    
    
    
    /* ************************************************************************ *
        Command sending
     * ************************************************************************ */

    /**
     * Get the URL for an API call of given key
     * 
     * @param string    $key            The key
     * @param boolean   $long           (Optional) Long pressure ?
     * @param integer   $repetition     (Optional) Repetition count
     * 
     * @return string   The URL
     */
    protected function _getCommandUrl ($key, $long = false, $repetition = 1)
    {
        $params = array();
        $params[self::URLPARAM_CODE] = $this->_virtualRemoteCode;
        $params[self::URLPARAM_KEY] = (string) $key;
        
        if ($long === true) {
            $params[self::URLPARAM_LONG] = 'true';
        }
        
        if (is_int($repetition) && $repetition >= 2) {
            $params[self::URLPARAM_REPETITION] = $repetition;
        }
        
        return $this->_baseUrl . '?' . http_build_query($params);
    }
    
    
    /**
     * Actually send a command
     * 
     * @param string|array  $key            The key to send or an array representing a command
     * @param boolean       $long           (Optional) Long pressure ?
     * @param integer       $repetition     (Optional) Repetition count
     * 
     * @return boolean  <code>bool(true)</code> if the command was successfully sent, <code>bool(false)</code> otherwise
     */
    protected function _sendCommand ($key, $long = false, $repetition = 1, &$responseHeaders)
    {
        if (is_array($key)) {
            $long = $key['long'];
            $repetition = $key['repetition'];
            $key = $key['key'];
        }
        
        if ($key == self::WAIT_COMMAND) {        
            $this->_debug('WAIT_COMMAND received: Waiting ' . $repetition . ' times...');
            for ($i = 0; $i < $repetition; ++$i) {
                $this->_wait();
            }
        }
        else {
            $commandUrl = $this->_getCommandUrl($key, $long, $repetition);
            $this->_debug('Sending command "' . $key . '", ' . ($long ? 'long' : 'short') . ' pressure, ' . $repetition . ' times : ' . $commandUrl);
            
            $httpAdapter = $this->getOption('http_adapter');
            if ($httpAdapter === null) {
                $httpAdapter = self::DEFAULT_HTTPADAPTER;
            }
            switch ($httpAdapter) {
                // @TODO: Allow curl_*() as an http_adapter
                // @TODO: Allow AJAX as an http_adapter ?
                
                case self::HTTPADAPTER_GETHEADERS:
                default:
                    $sendResult = $this->_useHttpAdapter_getHeaders($commandUrl);
                    break; 
            }
            
            if ($sendResult === false) {
                return false;
            }
            else {
                if ($key == self::KEY_POWER) {
                   $this->_wait();
                }
                return true;
            }
        }
    }
    
    /**
     * Uses HTTP adapter getHeaders() 
     * 
     * @param string    $commandUrl The URL to call
     * 
     * @return boolean  <code>bool(true)</code> if the command was successfully sent, <code>bool(false)</code> otherwise
     */
    protected function _useHttpAdapter_getHeaders ($commandUrl) {
        $responseHeaders = get_headers($commandUrl);
        $responseHeadersStatusCode = explode(' ', $responseHeaders[0]);
        if ($responseHeadersStatusCode[1] === (string) 200) {
            return true;
        }
        else {
            return false;
        }
    }
    
    
    /**
     * Send a command
     * 
     * @param string|array    $key            The key to send
     * @param boolean|array   $long           (Optional) Long pressure ?
     * @param integer|array   $repetition     (Optional) Repetition count
     * 
     * @return array    An array listing each successful commands under the 'ok' key 
     *                  and each unsuccessful commands under the 'nok' key
     */
    public function sendCommand ($key, $long = false, $repetition = 1)
    {
        $commands = array();
        if (is_array($key)) {
            $key_count = count($key);
            
            if (is_array($long)) {
                $long_count = count($long);
                if ($long_count !== 1 && $long_count !== $key_count) {
                    throw new Exception('Parameter $long is incorrect');
                }
            }
            else {
                $long = array($long);
                $long_count = 1;
            }
            
            if (is_array($repetition)) {
                $repetition_count = count($repetition);
                if ($repetition_count !== 1 && $repetition_count !== $key_count) {
                    throw new Exception('Parameter $$repetition_count is incorrect');
                }
            }
            else {
                $repetition = array($repetition);
                $repetition_count = 1;
            }
            // Post-relation :
            //   $key is an array of $key_count elements
            //   $long is an array of 1 or $key_count elements
            //   $repetition is an array of 1 or $key_count elements
            
            if ($long_count === 1) {
                $long = array_fill(0, $key_count, $long[0]);
            }
            if ($repetition_count === 1) {
                $repetition = array_fill(0, $key_count, $repetition[0]);
            }
            
            for ($i = 0; $i < $key_count; ++$i) {
                $newCommand = array(
                    'key' => $key[$i], 
                    'long' => $long[$i], 
                    'repetition' => $repetition[$i]
                );
                $commands[] = $newCommand;
                $this->_debug(print_r($newCommand, true)); //DEBUG:
            }
        }
        else {
            $commands[] = array( // Make that single command part of an array
                'key' => $key, 
                'long' => $long, 
                'repetition' => $repetition
            );
        }
        
        return $this->sendCommands($commands);
    }
    
    /**
     * Send commands
     * 
     * @param array $commands   Array of commands to send
     * 
     * @return array    An array listing each successful commands under the 'ok' key 
     *                  and each unsuccessful commands under the 'nok' key
     */
    public function sendCommands ($commands)
    {
        $ok = array();
        $nok = array();
        
        foreach ($commands as $currentCommand) {
            $currentCommandResponse = null;
            if ($this->_sendCommand($currentCommand['key'], $currentCommand['long'], $currentCommand['repetition'], $currentCommandResponse)) {
                $currentCommand['response'] = $currentCommandResponse;
                $ok[] = $currentCommand;
            }
            else {
                $currentCommand['response'] = $currentCommandResponse;
                $nok[] = $currentCommand;
            }
        }
        
        return array(
            'ok' => $ok,
            'nok' => $nok,
        );
    }
    
    /**
     * Send an integer
     * 
     * @param integer   $integer        The integer to send
     * @param integer   $repetition     (Optional) Number of time to repeat the integer
     * 
     * @return array    An array listing each successful commands under the 'ok' key 
     *                  and each unsuccessful commands under the 'nok' key
     */
    public function sendInteger ($integer, $repetition = 1)
    {
        return $this->sendCommands($this->_generateIntegerCommands($integer, $repetition));
    }
    
    /**
     * Send an character
     * 
     * @param string    $character      The character to send
     * @param integer   $repetition     (Optional) Number of time to repeat the character
     * 
     * @return array    An array listing each successful commands under the 'ok' key 
     *                  and each unsuccessful commands under the 'nok' key
     */
    public function sendCharacter ($character, $repetition = 1)
    {
        return $this->sendCommands($this->_generateCharacterCommands($character, $repetition));
    }
    
    /**
     * Send an string
     * 
     * @param string    $string         The string to send
     * @param integer   $repetition     (Optional) Number of time to repeat the string
     * 
     * @return array    An array listing each successful commands under the 'ok' key 
     *                  and each unsuccessful commands under the 'nok' key
     */
    public function sendString ($string, $repetition = 1)
    {
        return $this->sendCommands($this->_generateStringCommands($string, $repetition));
    }
    /* ************************************************************************ */
    
    
    
    /* ************************************************************************ *
        Command generation
     * ************************************************************************ */
    
    /**
     * Generates a command for a specific key
     * 
     * @param string    $key             The key
     * @param boolean   $long           (Optional) Long pressure ?
     * @param integer   $repetition     (Optional) Repetition count
     * 
     * @return array    An array representing the command
     */
    protected function _generateCommand ($key, $long = false, $repetition = 1)
    {
        return array('key' => (string) $key, 'long' => (boolean) $long, 'repetition' => (int) $repetition);
    }
    
    /**
     * Repeats a command
     * 
     * @param array     $commands       Commands to repeat
     * @param integer   $repetition     (Optional) Number of time to repeat the command
     * 
     * @return array    The repeated array of commands
     */
    protected function _repeatCommand (array $commands, $repetition = 1)
    {
        for ($i = 1; $i < $repetition; ++$i) {
            $commands = array_merge($commands, $commands);
        }
        return $commands;
    }
    
    /**
     * Generates a fake-wait commands
     * 
     * @param integer $repetition   (Optional) Number of time to wait
     * 
     * @return array    The array of commands
     */
    protected function _generateWaitCommand ($repetition = 1)
    {
        return $this->_generateCommand(self::WAIT_COMMAND, false, $repetition);
    }
    
    /**
     * Generates commands to send an integer
     * 
     * @param integer   $integer        The integer to generate for
     * @param integer   $repetition     (Optional) Number of time to repeat the integer
     * 
     * @return array    The array of commands
     */
    protected function _generateIntegerCommands ($integer, $repetition = 1)
    {
        if ((int) $integer < 10) {
            return _generateCommand($integer, false, $repetition);
        }
        else {
            $commands = array();
            
            $integerAsString = (string) $integer;
            $integerAsString_len = strlen($integerAsString);
            for ($i = 0; $i < $integerAsString_len; ++$i) {
                $commands[] = $this->_generateCommand(
                    constant('self::KEY_' . $integerAsString[$i]), 
                    ($i != $integerAsString_len-1 ? true : false) // If it's not the last digit: long pressure, short otherwise
                );
            }
            
            return $this->_repeatCommand($commands, $repetition);
        }
    }
    
    /**
     * Generates commands to send a character
     * 
     * @param string    $character      The character to generate for
     * @param integer   $repetition     (Optional) Number of time to repeat the character
     * 
     * @return array    The array of commands
     */
    protected function _generateCharacterCommands ($character, $repetition = 1)
    {
        if (!array_key_exists($character, $this->_keypad_char2keyMapping)) {
            return array();
        }
        
        $commands = array();

        for ($i = 0; $i <= $this->_keypad_char2keyMapping[$character]['pos']; ++$i) {
            $commands[] = $this->_generateCommand($this->_keypad_char2keyMapping[$character]['key']);
        }
        
        return $this->_repeatCommand($commands, $repetition);
    }
    
    /**
     * Generates commands to send a string
     * 
     * @param string    $string         The string to generate for
     * @param integer   $repetition     (Optional) Number of time to repeat the string
     * 
     * @return array    The array of commands
     */
    protected function _generateStringCommands ($string, $repetition = 1)
    {
        $commands = array();
        
        foreach ($this->_splitString($string) as $currentCharacter) {
            $commands = array_merge($commands, $this->_generateCharacterCommands($currentCharacter));
            $commands[] = $this->_generateWaitCommand(1);
        }
        
        return $this->_repeatCommand($commands, $repetition);
    }
    /* ************************************************************************ */
    
    
    
    /* ************************************************************************ *
        Various utility methods
     * ************************************************************************ */
    
    /**
     * Retrieve all characters of a UTF-8 string in an array. 
     * 
     * @param string $string    The string to explode
     * 
     * @return array    All the characters of $string
     */
    protected static function _splitString ($string)
    {
        $splitted = preg_split('//u', $string);
        array_shift($splitted);
        array_pop($splitted);
        return $splitted;
    }
    
    /**
     * Wait a second
     */
    protected function _wait ()
    {
        sleep(1);
    }
    /* ************************************************************************ */
    
    
    
    /**
     * Log debug informations
     * 
     * @param string $msg   The debug message
     */
    protected function _debug ($msg)
    {
        if ($this->_debug) {
            echo '<p style="font-style: italic; color: red;">DEBUG: ' . $msg . '</p>' . PHP_EOL;
        }
    }
    /* ************************************************************************ */
}