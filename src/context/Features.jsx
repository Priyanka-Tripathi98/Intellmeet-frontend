import {Video,Sparkles,CheckSquare,Shield, Calendar,Search,Activity,Users} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <Sparkles size={28} />,
      title: "AI Summaries",
      desc: "Get concise, accurate summaries of every meetings with key points and action items.",
    },
     {
     icon:<CheckSquare size={28}/>,
     title: "Action Items",
     desc: "Automatically captures tasks, assign owners and track progress in one place."
    },
     {
      icon: <Search size={28} />,
      title: "Smart Search",
      desc: "Quickly find conversations, notes, and meeting insights.",
    },
    {
     icon:<Activity size={28}/>,
     title:"Real-time Insights",
     desc:"Get meeting analytics and insights to improve team productivity.",
    },
    {
      icon: <Video size={28} />,
      title: "HD Video Calls",
      desc: "Crystal-clear meetings with screen sharing and recording support.",
    },
    {
     icon:<Users size={28}/>,
     title:"Team Collaboration",
     desc:"Collaborate in real time with chat, comments and file sharing."
    },
    {
      icon: <Shield size={28} />,
      title: "Enterprise Security",
      desc: "End-to-end encryption and enterprise-grade security to protect your data.",
    },
   {
    icon:<Calendar size={28}/>,
    title:"Calendar Integration",
    desc:"Seamissesly Integrate with Google Calendar,Outlook and more."
   }
  ];

  return (
    <section
      id="features"
      style={{
        padding: "120px 5%",
        background: "#03040b",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "-10%",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(124,58,237,0.18), transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Heading */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "70px",
          }}
        >
          <p
            style={{
              color: "#a855f7",
              fontWeight: "700",
              letterSpacing: "2px",
              marginBottom: "18px",
            }}
          >
            FEATURES
          </p>

          <h2
            style={{
              fontSize: "56px",
              lineHeight: "1.1",
              fontWeight: "800",
              color: "#fff",
              maxWidth: "850px",
              margin: "0 auto",
            }}
          >
            Everything you need for
            <span
              style={{
                background:
                  "linear-gradient(135deg,#c084fc,#6366f1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {" "}
              smarter meetings
            </span>
          </h2>

          <p
            style={{
              color: "#94a3b8",
              marginTop: "24px",
              fontSize: "18px",
              lineHeight: "1.7",
              maxWidth: "650px",
              marginInline: "auto",
            }}
          >
            IntellMeet combines AI-powered collaboration tools
            with seamless communication for modern teams.
          </p>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(260px,1fr))",
            gap: "28px",
          }}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                padding: "35px",
                borderRadius: "28px",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(18px)",
                transition: "0.35s ease",
                cursor: "pointer",
                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.25)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-8px)";
                e.currentTarget.style.border =
                  "1px solid rgba(168,85,247,0.4)";
                e.currentTarget.style.boxShadow =
                  "0 20px 50px rgba(124,58,237,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translateY(0px)";
                e.currentTarget.style.border =
                  "1px solid rgba(255,255,255,0.08)";
                e.currentTarget.style.boxShadow =
                  "0 10px 30px rgba(0,0,0,0.25)";
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: "62px",
                  height: "62px",
                  borderRadius: "18px",
                  background:
                    "linear-gradient(135deg,#7c3aed,#6366f1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "24px",
                  color: "#fff",
                  boxShadow:
                    "0 10px 25px rgba(124,58,237,0.35)",
                }}
              >
                {feature.icon}
              </div>

              <h3
                style={{
                  fontSize: "24px",
                  marginBottom: "14px",
                  color: "#fff",
                }}
              >
                {feature.title}
              </h3>

              <p
                style={{
                  color: "#94a3b8",
                  lineHeight: "1.8",
                  fontSize: "16px",
                }}
              >
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
    
  );
  
}