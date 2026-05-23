// LEGACY UNREFACTORED RECOMMENDER CODE (SPAGHETTI CODE WITH SMELLS)
// WARNING: This file is kept as part of historical code demonstration.
// Smells: God method, Callback hell, Duplicate loops, Hardcoded values, No error handling, Side effects.

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

function getRecommendationsLegacy(userId, callback) {
  var db = new sqlite3.Database(path.resolve(__dirname, '../database.sqlite'), function(err) {
    if (err) {
      console.log("DB ERROR!");
      callback(err, null);
    } else {
      // Step 1: Get user enrollments
      db.all("SELECT course_id FROM enrollments WHERE user_id = " + userId, [], function(err, enrollments) {
        if (err) {
          console.log("Error enrollments");
          callback(err, null);
        } else {
          var enrolledIds = [];
          for (var i = 0; i < enrollments.length; i++) {
            enrolledIds.push(enrollments[i].course_id);
          }

          // Step 2: Get user bookmarks
          db.all("SELECT course_id FROM bookmarks WHERE user_id = " + userId, [], function(err, bookmarks) {
            if (err) {
              console.log("Error bookmarks");
              callback(err, null);
            } else {
              var bookmarkedIds = [];
              for (var j = 0; j < bookmarks.length; j++) {
                bookmarkedIds.push(bookmarks[j].course_id);
              }

              // Step 3: Get all courses to compare
              db.all("SELECT id, title, category, rating FROM courses", [], function(err, courses) {
                if (err) {
                  callback(err, null);
                } else {
                  var recommended = [];
                  
                  // Big nested loop matching categories
                  for (var k = 0; k < courses.length; k++) {
                    var course = courses[k];
                    
                    // Skip if enrolled
                    var isEnrolled = false;
                    for (var x = 0; x < enrolledIds.length; x++) {
                      if (enrolledIds[x] === course.id) {
                        isEnrolled = true;
                      }
                    }
                    if (isEnrolled) continue;

                    var score = 0;
                    
                    // Calculate weight based on enrollments categories
                    for (var eIndex = 0; eIndex < enrolledIds.length; eIndex++) {
                      // Fetch category of enrolled course (Synchronous query blocking event loop!)
                      // Oh wait, legacy code might query inside loop (n+1 problem!)
                      // Here we simulate checking category by comparing IDs
                      for (var z = 0; z < courses.length; z++) {
                        if (courses[z].id === enrolledIds[eIndex]) {
                          if (courses[z].category === course.category) {
                            score += 3; // hardcoded score
                          }
                        }
                      }
                    }

                    // Calculate weight based on bookmarks
                    for (var bIndex = 0; bIndex < bookmarkedIds.length; bIndex++) {
                      for (var z2 = 0; z2 < courses.length; z2++) {
                        if (courses[z2].id === bookmarkedIds[bIndex]) {
                          if (courses[z2].category === course.category) {
                            score += 1.5; // hardcoded score
                          }
                        }
                      }
                    }

                    // Add rating
                    score += course.rating * 0.5;

                    // Add AI randomness
                    score += Math.random() * 0.3;

                    course.recScore = Math.round(score * 100) / 100;
                    
                    if (score > 0) {
                      course.recReason = "Because you like " + course.category;
                    } else {
                      course.recReason = "Highly recommended for you.";
                    }

                    recommended.push(course);
                  }

                  // Sort recommended courses
                  for (var m = 0; m < recommended.length; m++) {
                    for (var n = m + 1; n < recommended.length; n++) {
                      if (recommended[m].recScore < recommended[n].recScore) {
                        var temp = recommended[m];
                        recommended[m] = recommended[n];
                        recommended[n] = temp;
                      }
                    }
                  }

                  // return top 3
                  var top3 = [];
                  for (var p = 0; p < Math.min(3, recommended.length); p++) {
                    top3.push(recommended[p]);
                  }

                  db.close();
                  callback(null, top3);
                }
              });
            }
          });
        }
      });
    }
  });
}

module.exports = {
  getRecommendationsLegacy
};
