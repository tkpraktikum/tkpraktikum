angular
  .module('app')
  .controller('ReviewListController', ['$scope', '$state', 'Review', 'AuthService', 'User', '$stateParams',
    function($scope, $state, Review, AuthService, User, $stateParams) {

      var md = "# Per et sit cerva minata proles tamen\n \n## Imbres Scirone prima armenti tamen ferrum matertera\n \n Lorem markdownum iamque pallentia tibi solebant. Docendam mihi; nata magniloquo\n tegmine dissimilem, et fruticosa quae. Sparte meliore in quidque feroces\n [sed](http://esse.com/fugientis.php) iubet. Reditus *cuique* sui teres quos:\n deque et ipse **membra est**, se sed, me vale.\n \n - Furibunda cura fuerat maioris pollicita viscera\n - Nam insonat\n - Pars rigidi\n - Placidos pro\n - Iacebat canis hac sub manusque ut gemino\n \n## Silet est ripas confessus vocem premeret idque\n \n Praescia lues ore corpus in stultae flammae: si dies principio terram. Maculoso\n Ino quaerit decuit Parnasos respondent tibi tua iuppiter bella est adopertaque\n mora iustamque. Refert leaena **qui**, a femineae debita axes *ait* busta sim\n hinc cornibus arcana! Concipe ego lumina mille, te deos. Vi oculis et urbem\n orantem mutare.\n \n Luctusque **dimovit retia** nec exhalat mortali parens hospes facta thalamo meo.\n Exit oro erile ter, fratrem, et opes me validos, et. Rudibusque probat alios\n garrulitas tantum viscera inmotusque carpunt, si ille manus tenui gemellos non\n sed conveniant Ammon, Thaumantidos? Curru novissima ignarus tamen crudelius\n praeceps ferox valens membra Carthaea mortis et numen Neritius **audaces**.\n \n## Unda quas caecaeque et abit\n \n Dixisse eque ille mediis dis inania, me validos etiam parvis inpugnante sunt;\n tamen si. Genetrix corneus expugnacior quod circumdata gaudia natis terribiles\n et ducta!\n \n 1. Vir caelicolae\n 2. Nec vivere caelum\n 3. Potes aures iamque dilectu\n 4. Quas lacertis fuit et incursurus postera et\n 5. Cui vela tenebant conscia toros removebitur genus\n 6. Threicius ferro iuvencis\n \nQuidem in hosti. Vos vocis, pedibusve nam. Per [nec](http://www.pitanen-tu.com/)\n et passus. Una pervia habebat **glacialis tamen Lotis** instruit et haec. Visus\n me insania habitat.\n \n Meritis Gangesque. A fletus innocuae capit nulla sequente non **aera** quoque\n hasta te luctus Silenum manu posita vulnera.\n";

      $scope.reviews = [
        {
          submissionTitle: 'From the Cloud to the Atmosphere: Running MapReduce across Datacenters',
          expertise: 4,
          rating: 3,
          summary: md,
          strong: md,
          weak: md,
          detailed: md
        }];
    }]);
