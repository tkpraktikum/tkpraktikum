var logger = require('winston');

module.exports = function(app, ds, callback) {
  var conferences = [
    { name: 'AWS re:Invent',
      sharedSecret: 'aws',
      description: 'At AWS re:Invent 2016, connect with peers and cloud experts, collaborate at our bootcamps, and learn how AWS can improve productivity, security and performance.'
    },
    { name: 'Google I/O',
      sharedSecret: 'google',
      description: 'Google I/O (simply I/O) is an annual developer conference held by Google in San Francisco, California. I/O showcases technical in-depth sessions focused on building web, mobile, and enterprise applications with Google and open sources such as Android, ChromeCandhrome OS, APIs, Google Web Toolkit, App Engine, and more'
    },
    { name: 'TechEd',
      sharedSecret: 'teched',
      description: 'TechEd was an annual conference for developers and IT professionals put on by Microsoft. It took place in several locations around the world. The first TechEd happened in 1993 in Orlando, Florida, United States, the last took place in Barcelona in 2014. Microsoft rescheduled its conference schedule and introduced Microsoft Ignite from 2015 on.The conference normally lasts between three and five days, and consists of presentation and whiteboard sessions and hands-on labs. It offers opportunities to meet Microsoft experts, MVPs and community members. Networking is enhanced through parties, community areas and Ask the Expert sessions. The event also includes an exhibition area where vendors can show off technologies and sell products. There is a vast content catalog from which attendees can select sessions that will be most beneficial. An agenda is published online before the conference begins.'
    },
    { name: 'Apache Spark Summit',
      sharedSecret: 'spark',
      description: 'Since our inaugural event in 2013, thousands of developers, scientists, analysts, researchers and executives from around the globe have flocked to Spark Summit to better understand how big data, machine learning and data science can deliver new insights. Whether you’re new to Apache Spark or a hardcore enthusiast, Spark Summit is the place to meet with leading experts to share knowledge, receive training and foster valuable connections.'
    }
  ];

  app.models.Conference.create(conferences, function(err) {
    if (!err) {
      logger.info('Created conferences');
    }

    callback(err);
  });
};
