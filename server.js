import express from "express";
const server = require('http').createServer();
const cors = require('cors');
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});
const app=express();
app.use("/",(req,res)=>{
re.json({message:"hello server"});
});

const nodes = []; // Global variable to store node positions
const edges = []; // Global variable to store edge information

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Listen for new node events from clients
  socket.on('newNode', (newNode) => {
    console.log('New node received:', newNode);
    // Add the new node to the global nodes array
    nodes.push(newNode);
    // Broadcast the new node to all connected clients (including the sender)
    io.emit('newNode', newNode);
  });

  // Listen for new edge events from clients
  socket.on('newEdge', (newEdge) => {
    console.log('New edge received:', newEdge);
    // Add the new edge to the global edges array
    edges.push(newEdge);
    // Broadcast the new edge to all connected clients (including the sender)
    io.emit('newEdge', newEdge);
  });

  socket.on('deleteNodes', (nodesToRemove) => {
    console.log('Nodes to remove:', nodesToRemove);
    // Remove the nodes from the global nodes array
    nodesToRemove.forEach((nodeId) => {
      const index = nodes.findIndex((node) => node.id === nodeId);
      if (index !== -1) {
        nodes.splice(index, 1);
      }
    });
    // Broadcast the deleted nodes to all connected clients (including the sender)
    io.emit('deleteNodes', nodesToRemove);
  });

  // Listen for delete edge events from clients
  socket.on('deleteEdge', (edgeId) => {
    console.log('Edge to remove:', edgeId);
    // Remove the edge from the global edges array
    const index = edges.findIndex((edge) => edge.id === edgeId);
    if (index !== -1) {
      edges.splice(index, 1);

      socket.broadcast.emit('deleteEdge', edgeId);
    }
  });

  socket.on('updateNodePosition', (updatedNode) => {
    console.log('Updated node received:', updatedNode);
    const { id, position } = updatedNode;
    const nodeIndex = nodes.findIndex((node) => node.id === id);
    if (nodeIndex !== -1) {
      nodes[nodeIndex].position = position;
      // Broadcast the updated node position to all connected clients (including the sender)
      io.emit('updateNodePosition', updatedNode);
    }
  });

  socket.on('updateEdge', (updatedEdge) => {
    console.log('Updated edge received:', updatedEdge);
    const { id } = updatedEdge;
    const edgeIndex = edges.findIndex((edge) => edge.id === id);
    if (edgeIndex !== -1) {
      edges[edgeIndex] = updatedEdge;
      // Broadcast the updated edge to all connected clients (including the sender)
      io.emit('updateEdge', updatedEdge);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT =  5000;
server.listen(PORT, () => {
  console.log(`Socket.IO server listening on port ${PORT}`);
});
